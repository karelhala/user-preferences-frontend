import React, { useState, useEffect, Fragment } from 'react';
import './email.scss';
import { useSelector, useDispatch } from 'react-redux';
import { componentMapper, FormTemplate } from '@data-driven-forms/pf4-component-mapper';
import { Main, PageHeader, PageHeaderTitle, Skeleton } from '@redhat-cloud-services/frontend-components';
import {
    Card,
    CardBody,
    Stack,
    StackItem,
    CardHeader,
    TextContent,
    Text,
    TextVariants,
    Spinner,
    Bullseye,
    DataList,
    DataListItem,
    DataListItemRow,
    DataListItemCells,
    DataListCell
} from '@patternfly/react-core';
import FormRender from '@data-driven-forms/react-form-renderer';
import { DESCRIPTIVE_CHECKBOX, DATA_LIST, LOADER, DescriptiveCheckbox, DataListLayout, Loader } from '../../SmartComponents/FormComponents';
import config from '../../config.json';
import { emailPreferences, register } from '../../store';
import { saveEmailValues } from '../../actions';
import { calculateEmailConfig, getSection, distributeSuccessError, dispatchMessages } from '../../Utilities/functions';
import FormButtons from '../shared/FormButtons';

const Email = () => {
    const [ emailConfig, setEmailConfig ] = useState({});
    const [ currentUser, setCurrentUser ] = useState({});
    const [ isLoaded, setLoaded ] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            register(emailPreferences);
            const { identity } = await insights.chrome.auth.getUser();
            setCurrentUser(identity.user);
            setEmailConfig((await calculateEmailConfig(config, dispatch)));
            setLoaded(true);
        })();
    }, []);

    const store = useSelector(({ emailPreferences }) => emailPreferences);

    // eslint-disable-next-line no-unused-vars
    const saveValues = async ({ unsubscribe, ...values }) => {
        const promises = Object.entries(emailConfig)
        .filter(([ , { isVisible }]) => isVisible === true)
        .map(([ application, { localFile, schema, url, apiName }]) => {
            if (!localFile && !schema && store?.[application]?.schema && Object.keys(store?.[application]?.schema).length > 0) {
                const action = saveEmailValues({ application, values, url, apiName });
                dispatch(action);

                return {
                    promise: action.payload,
                    meta: action.meta
                };
            }
        }).filter(Boolean);

        const { success, error } = await distributeSuccessError(promises);
        dispatchMessages(dispatch, success, error);
    };

    const calculateSection = (key, schema) => {
        return getSection(key, schema, store?.[key], (isVisible) => {
            const { ...config } = emailConfig;
            if (isVisible === false) {
                delete config[key];
            } else {
                config[key] = {
                    ...config[key],
                    isVisible
                };
            }

            setEmailConfig(config);
        });
    };

    const personalInfoUrl = `https://www.${insights.chrome.isProd ? '' : 'qa.'}redhat.com/wapps/ugc/protected/emailChange.html`;

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title='Email preferences'/>
            </PageHeader>
            <Main className="pref-email">
                <Stack hasGutter>
                    <StackItem>
                        <Card className="pref-email__info">
                            <CardHeader>
                                <TextContent>
                                    <Text component={ TextVariants.h2 }>Your information</Text>
                                </TextContent>
                            </CardHeader>
                            <CardBody>
                                <DataList>
                                    <DataListItem>
                                        <DataListItemRow>
                                            <DataListItemCells dataListCells={ [
                                                <DataListCell
                                                    isFilled={ false }
                                                    className="pref-c-title pref-u-bold pref-u-condensed"
                                                    key="email-title">
                                                    Email address
                                                </DataListCell>,
                                                <DataListCell
                                                    isFilled
                                                    key="email-value"
                                                    className="pref-email__info-user-email pref-u-condensed"
                                                >
                                                    { isLoaded ? (
                                                        <Fragment className="pref-u-condensed">
                                                            <span>{currentUser.email}</span>
                                                            <a
                                                                rel="noopener noreferrer"
                                                                target="_blank"
                                                                href={ personalInfoUrl }>
                                                            Not correct?
                                                            </a>
                                                        </Fragment>
                                                    ) : (
                                                        <Skeleton size='lg'></Skeleton>
                                                    )}
                                                </DataListCell>
                                            ] }/>
                                        </DataListItemRow>
                                    </DataListItem>
                                </DataList>
                            </CardBody>
                        </Card>
                    </StackItem>
                    <StackItem>
                        <Card>
                            <CardHeader className="pref-email__info-head">
                                <TextContent>
                                    <Text component={ TextVariants.h2 }>Email subscriptions</Text>
                                </TextContent>
                                <div className="pref-email_subheader">Select the cloud.redhat.com emails you want to receive.</div>
                            </CardHeader>
                            <CardBody className="pref-email_form">
                                {isLoaded ? <FormRender
                                    componentMapper={ {
                                        ...componentMapper,
                                        [DESCRIPTIVE_CHECKBOX]: DescriptiveCheckbox,
                                        [LOADER]: Loader,
                                        [DATA_LIST]: DataListLayout
                                    } }
                                    FormTemplate={ (props) => <FormTemplate { ...props } FormButtons={ FormButtons } /> }
                                    schema={ {
                                        fields: [{
                                            name: 'email-preferences',
                                            component: DATA_LIST,
                                            sections: Object.entries(emailConfig)
                                            .map(([ key, schema ]) => calculateSection(key, schema))
                                        }]
                                    } }
                                    onSubmit={ saveValues }
                                /> : <Bullseye>
                                    <Spinner />
                                </Bullseye>}
                            </CardBody>
                        </Card>
                    </StackItem>
                </Stack>
            </Main>
        </React.Fragment>
    );
};

export default Email;
