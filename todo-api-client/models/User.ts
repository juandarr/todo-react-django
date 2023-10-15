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

import { exists, mapValues } from "../runtime";
/**
 *
 * @export
 * @interface User
 */
export interface User {
  /**
   *
   * @type {number}
   * @memberof User
   */
  readonly id: number;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @type {string}
   * @memberof User
   */
  username: string;
  /**
   *
   * @type {string}
   * @memberof User
   */
  email?: string;
  /**
   *
   * @type {string}
   * @memberof User
   */
  firstName?: string;
  /**
   *
   * @type {string}
   * @memberof User
   */
  lastName?: string;
  /**
   *
   * @type {number}
   * @memberof User
   */
  inboxId?: number | null;
}

/**
 * Check if a given object implements the User interface.
 */
export function instanceOfUser(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && "id" in value;
  isInstance = isInstance && "username" in value;

  return isInstance;
}

export function UserFromJSON(json: any): User {
  return UserFromJSONTyped(json, false);
}

export function UserFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): User {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json["id"],
    username: json["username"],
    email: !exists(json, "email") ? undefined : json["email"],
    firstName: !exists(json, "first_name") ? undefined : json["first_name"],
    lastName: !exists(json, "last_name") ? undefined : json["last_name"],
    inboxId: !exists(json, "inbox_id") ? undefined : json["inbox_id"],
  };
}

export function UserToJSON(value?: User | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    username: value.username,
    email: value.email,
    first_name: value.firstName,
    last_name: value.lastName,
    inbox_id: value.inboxId,
  };
}
