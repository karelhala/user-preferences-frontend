import React from 'react';
import {
    DataList,
    DataListItem,
    DataListItemRow,
    DataListItemCells,
    DataListCell
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const DataListLayout = ({ sections, label, name, FormSpyProvider, FieldProvider, formOptions, validate, ...props }) => (
    <DataList aria-label={ label || name } { ...props }>
        {sections.map(({ label, fields }, key) => {
            let actualFields = Array.isArray(fields) ? fields : [ fields ];
            actualFields = actualFields.length === 0 ? [{ fields: []}] : actualFields;
            console.log(actualFields, 'ffgf');
            return (
                <DataListItem key={ key } aria-labelledby="simple-item1">
                    {actualFields.map(({ fields: fieldsToRender }, fieldsKey) => (
                        <DataListItemRow key={ fieldsKey }>
                            <DataListItemCells dataListCells={ [
                                <DataListCell isFilled={ false } className="pref-c-title pref-u-bold" key="title">
                                    { fieldsKey === 0 ? label : '' }
                                </DataListCell>,
                                <DataListCell isFilled key={ `${fieldsKey}-content` }>
                                    {formOptions.renderForm(fieldsToRender, formOptions)}
                                </DataListCell>
                            ] } />
                        </DataListItemRow>
                    ))}
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
