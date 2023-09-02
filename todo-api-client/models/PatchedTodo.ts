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
import type { PriorityEnum } from './PriorityEnum';
import {
    PriorityEnumFromJSON,
    PriorityEnumFromJSONTyped,
    PriorityEnumToJSON,
} from './PriorityEnum';

/**
 * 
 * @export
 * @interface PatchedTodo
 */
export interface PatchedTodo {
    /**
     * 
     * @type {number}
     * @memberof PatchedTodo
     */
    readonly id?: number;
    /**
     * 
     * @type {string}
     * @memberof PatchedTodo
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedTodo
     */
    description?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof PatchedTodo
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedTodo
     */
    complete?: boolean;
    /**
     * 
     * @type {PriorityEnum}
     * @memberof PatchedTodo
     */
    priority?: PriorityEnum;
    /**
     * 
     * @type {number}
     * @memberof PatchedTodo
     */
    list?: number;
    /**
     * 
     * @type {number}
     * @memberof PatchedTodo
     */
    readonly user?: number;
}

/**
 * Check if a given object implements the PatchedTodo interface.
 */
export function instanceOfPatchedTodo(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function PatchedTodoFromJSON(json: any): PatchedTodo {
    return PatchedTodoFromJSONTyped(json, false);
}

export function PatchedTodoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedTodo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'title': !exists(json, 'title') ? undefined : json['title'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'createdAt': !exists(json, 'created_at') ? undefined : (new Date(json['created_at'])),
        'complete': !exists(json, 'complete') ? undefined : json['complete'],
        'priority': !exists(json, 'priority') ? undefined : PriorityEnumFromJSON(json['priority']),
        'list': !exists(json, 'list') ? undefined : json['list'],
        'user': !exists(json, 'user') ? undefined : json['user'],
    };
}

export function PatchedTodoToJSON(value?: PatchedTodo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'title': value.title,
        'description': value.description,
        'complete': value.complete,
        'priority': PriorityEnumToJSON(value.priority),
        'list': value.list,
    };
}

