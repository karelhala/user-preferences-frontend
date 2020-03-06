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
const DataListLayout = ({ sections, label, FieldProvider, formOptions, validate, ...rest }) => (
    <DataList aria-label={ label } { ...rest }>
        {sections.map(({ label, fields }, key) => (
            <DataListItem key={ key } aria-labelledby="simple-item1">
                <DataListItemRow>
                    <DataListItemCells
                        dataListCells={ [
                            <DataListCell isFilled={ false } className="pref-c-title pref-u-bold" key="title">
                                { label }
                            </DataListCell>,
                            <DataListCell isFilled key="content">
                                {formOptions.renderForm(fields, formOptions)}
                            </DataListCell>
                        ] }
                    />
                </DataListItemRow>
            </DataListItem>
        ))}
    </DataList>
);

DataListLayout.propTypes = {
    sections: PropTypes.array,
    FieldProvider: PropTypes.any.apply,
    formOptions: PropTypes.any,
    label: PropTypes.node,
    validate: PropTypes.any
};

export default DataListLayout;
