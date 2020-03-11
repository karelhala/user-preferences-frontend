import { getApplicationSchema, saveValues as save } from './api';
import { ACTION_TYPES } from './constants';

export const getEmailSchema = ({ application, apiVersion, resourceType = 'email-preference', schema }) => ({
    type: ACTION_TYPES.GET_EMAIL_SCHEMA,
    payload: schema || getApplicationSchema(application, apiVersion, resourceType),
    meta: {
        appName: application
    }
});

export const saveEmailValues = ({ application, values, apiVersion, resourceType = 'email-preference' }) => ({
    type: ACTION_TYPES.SAVE_EMAIL_SCHEMA,
    payload: save(application, values, apiVersion, resourceType),
    meta: {
        notifications: {
            fulfilled: {
                variant: 'success',
                title: 'Application settings saved',
                description: 'Settings for Red Hat Insights were replaced with new values.',
                dismissable: true
            }
        },
        appName: application
    }
});
