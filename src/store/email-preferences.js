import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { ACTION_TYPES } from '../constants';

const defaultState = {};

export const loading = (store, { meta }) => {
    return {
        ...store,
        [meta.appName]: {
            schema: [],
            loaded: false
        }
    };
};

export const getSchema = (store, { payload, meta }) => {
    console.log(payload, meta);
    return {
        ...store,
        [meta.appName]: {
            schema: payload,
            loaded: true
        }
    };
};

export default {
    emailPreferences: applyReducerHash({
        [ACTION_TYPES.GET_EMAIL_SCHEMA]: getSchema,
        [`${ACTION_TYPES.GET_EMAIL_SCHEMA}_FULFILLED`]: getSchema,
        [`${ACTION_TYPES.GET_EMAIL_SCHEMA}_PENDING`]: loading
    }, defaultState)
};
