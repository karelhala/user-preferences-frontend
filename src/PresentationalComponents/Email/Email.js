import React, { useState, useEffect } from 'react';
import './email.scss';
import { useSelector, useDispatch } from 'react-redux';
import { formFieldsMapper, layoutMapper } from '@data-driven-forms/pf4-component-mapper';
import { Main, PageHeader, PageHeaderTitle, Skeleton } from '@redhat-cloud-services/frontend-components';
import { Button, Card, CardBody, Stack, StackItem, Flex, FlexItem, FlexModifiers, CardHeader } from '@patternfly/react-core';
import FormRender from '@data-driven-forms/react-form-renderer';
import PropTypes from 'prop-types';
import { DESCRIPTIVE_CHECKBOX, DATA_LIST, LOADER, DescriptiveCheckbox, DataListLayout, Loader } from '../../SmartComponents/FormComponents';
import config from '../../config.json';
import { emailPreferences, register } from '../../store';
import { getEmailSchema, saveEmailValues } from '../../actions';

const FormButtons = ({ submitting, pristine, onCancel }) => (
    <div>
        <Button
            type="submit"
            isDisabled={ submitting || pristine }
            style={ { marginRight: 16 } }
            variant="primary">Save</Button>
        <Button
            variant="link"
            isDisabled={ pristine }
            onClick={ onCancel }>
                Cancel
        </Button>
    </div>
);

FormButtons.propTypes = {
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    onCancel: PropTypes.func,
    initialValues: PropTypes.any
};

const Email = () => {
    const email = config['email-preference'];
    const [ currentUser, setCurrentUser ] = useState({});
    const [ isLoaded, setLoaded ] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        register(emailPreferences);
        insights.chrome.auth.getUser().then(
            (data) => {
                setCurrentUser(data.identity.user);
                setLoaded(true);
            }
        );
        Object.entries(email).forEach(async ([ key, { localFile }]) => {
            if (localFile) {
                const newMapper = (await import(`../../${localFile}`)).default;
                dispatch(getEmailSchema({ schema: newMapper, application: key }));
            } else {
                dispatch(getEmailSchema({ application: key }));
            }
        });
    }, []);

    const store = useSelector(({ emailPreferences }) => emailPreferences);

    // eslint-disable-next-line no-unused-vars
    const saveValues = ({ general, unsubscribe, ...values }) => {
        Object.entries(email).forEach(([ application, { localFile, schema }]) => {
            if (!localFile && !schema) {
                dispatch(saveEmailValues({ application, values }));
            }
        });
    };

    const cancelEmail = () => {
        console.log('cancel pressed');
    };

    return (
        <React.Fragment>
            <PageHeader>
                <PageHeaderTitle title='Email preferences'/>
            </PageHeader>
            <Main className="pref-email">
                <Stack gutter="md">
                    <StackItem>
                        <Card className="pref-email__info">
                            <CardHeader className="pref-email__email__info-head">Your information</CardHeader>
                            <CardBody>
                                <Flex>
                                    <FlexItem
                                        className="pref-u-bold"
                                        breakpointMods={ [{ modifier: FlexModifiers['spacer-3xl'] }] }>
                                        Email address
                                    </FlexItem>
                                    <FlexItem className="pref-email_loader" breakpointMods={ [{ modifier: FlexModifiers['spacer-md'] }] }>
                                        { isLoaded ? (
                                            <span>{currentUser.email}</span>
                                        ) : (
                                            <Skeleton size='lg'></Skeleton>
                                        )}
                                    </FlexItem>
                                    <a href='#'>Not correct?</a>
                                </Flex>
                            </CardBody>
                        </Card>
                    </StackItem>
                    <StackItem>
                        <Card>
                            <CardHeader className="pref-email_head">
                                <div>Email subscriptions</div>
                                <div className="pref-email_subheader">Select the cloud.redhat.com emails you want to receive.</div>
                            </CardHeader>
                            <CardBody className="pref-email_form">
                                <FormRender
                                    keepDirtyOnReinitialize
                                    formFieldsMapper={ {
                                        ...formFieldsMapper,
                                        [DESCRIPTIVE_CHECKBOX]: DescriptiveCheckbox,
                                        [LOADER]: Loader,
                                        [DATA_LIST]: DataListLayout
                                    } }
                                    layoutMapper={ layoutMapper }
                                    schema={ {
                                        fields: [{
                                            name: 'email-preferences',
                                            component: DATA_LIST,
                                            sections: Object.entries(email).map(([ key, schema ]) => ({
                                                label: schema?.title,
                                                name: key,
                                                fields: schema.fields || store?.[key]?.schema || []
                                            }))
                                        }]
                                    } }
                                    renderFormButtons={ props => <FormButtons { ...props } onCancel={ cancelEmail } /> }
                                    onSubmit={ saveValues }
                                />
                            </CardBody>
                        </Card>
                    </StackItem>
                </Stack>
            </Main>
        </React.Fragment>
    );
};

export default Email;
