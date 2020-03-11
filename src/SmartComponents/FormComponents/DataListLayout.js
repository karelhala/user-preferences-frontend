import React, { Fragment, Component } from 'react';
import {
    DataList,
    DataListItem,
    DataListItemRow,
    DataListItemCells,
    DataListCell
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

class DataListRow extends Component {
    state = {
        hasError: false
    }

    componentDidCatch(_error, info) {
        this.setState({ hasError: info });
    }

    render() {
        const { fieldsKey, label, fields, formOptions } = this.props;
        const { hasError } = this.state;
        return <DataListItemRow>
            <DataListItemCells dataListCells={ [
                <DataListCell isFilled={ false } className="pref-c-title pref-u-bold" key="title">
                    { fieldsKey === 0 ? label : '' }
                </DataListCell>,
                <DataListCell isFilled key={ `${fieldsKey}-content` }>
                    { hasError ?
                        'Error while mapping fields, please check your schema if it has valid component types' :
                        formOptions.renderForm(fields, formOptions)
                    }
                </DataListCell>
            ] } />
        </DataListItemRow>;
    }
}

DataListRow.propTypes = {
    fieldsKey: PropTypes.string,
    fields: PropTypes.array,
    FieldProvider: PropTypes.any,
    formOptions: PropTypes.any,
    label: PropTypes.node,
    name: PropTypes.string,
    validate: PropTypes.any,
    FormSpyProvider: PropTypes.any
};

// eslint-disable-next-line no-unused-vars
const DataListLayout = ({ sections, label, name, FormSpyProvider, FieldProvider, formOptions, validate, ...props }) => (
    <DataList aria-label={ label || name } { ...props }>
        {sections.map(({ label, fields }, key) => {
            const actualFields = Array.isArray(fields) ? fields : [ fields ];
            return (
                actualFields.length === 0 ? <Fragment /> : <DataListItem name={ name } key={ key } aria-labelledby="simple-item1">
                    {actualFields.map(({ fields: fieldsToRender }, fieldsKey) => {
                        return (
                            <DataListRow key={ fieldsKey }
                                fieldsKey={ fieldsKey }
                                label={ label }
                                fields={ fieldsToRender }
                                formOptions={ formOptions }
                            />
                        );
                    })}
                </DataListItem>
            );
        })}
    </DataList>
);

DataListLayout.propTypes = {
    sections: PropTypes.array,
    FieldProvider: PropTypes.any,
    formOptions: PropTypes.any,
    label: PropTypes.node,
    name: PropTypes.string,
    validate: PropTypes.any,
    FormSpyProvider: PropTypes.any
};

export default DataListLayout;
