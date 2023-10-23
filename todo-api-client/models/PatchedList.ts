/* tslint:disable */
/* eslint-disable */
/**
 * 
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface PatchedList
 */
export interface PatchedList {
    /**
     * 
     * @type {number}
     * @memberof PatchedList
     */
    readonly id?: number;
    /**
     * 
     * @type {string}
     * @memberof PatchedList
     */
    title?: string;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedList
     */
    archived?: boolean;
    /**
     * 
     * @type {number}
     * @memberof PatchedList
     */
    readonly user?: number;
}

/**
 * Check if a given object implements the PatchedList interface.
 */
export function instanceOfPatchedList(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function PatchedListFromJSON(json: any): PatchedList {
    return PatchedListFromJSONTyped(json, false);
}

export function PatchedListFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedList {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'title': !exists(json, 'title') ? undefined : json['title'],
        'archived': !exists(json, 'archived') ? undefined : json['archived'],
        'user': !exists(json, 'user') ? undefined : json['user'],
    };
}

export function PatchedListToJSON(value?: PatchedList | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'title': value.title,
        'archived': value.archived,
    };
}
