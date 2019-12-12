import { getToken } from "./token";

/**
 * https://github.com/reload/material-list/blob/develop/spec/material-list-1.0.0.yaml
 *
 * @class MaterialList
 */
class MaterialList {
  constructor() {
    this.token = getToken();
    this.baseUrl = "https://test.materiallist.dandigbib.org";
  }

  /**
   * Get list with materials.
   *
   * @param {string} listId
   * @returns {Promise<string[]>}
   * @memberof MaterialList
   */
  async getList(listId = "default") {
    const raw = await fetch(`${this.baseUrl}/list/${listId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`
      }
    });
    const response = await raw.json();
    return response.materials;
  }

  /**
   * Check existence of material on list.
   *
   * @param {object} options
   * @param {string} options.listId
   * @param {string} options.materialId
   * @returns {Promise}
   * @memberof MaterialList
   */
  async checkListMaterial({ listId = "default", materialId } = {}) {
    if (!materialId) {
      throw Error("materialId must be specified");
    }
    await fetch(`${this.baseUrl}/list/${listId}/${materialId}`, {
      method: "HEAD",
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  /**
   * Add material to the the list.
   *
   * @param {object} options
   * @param {string} options.listId
   * @param {string} options.materialId
   * @returns {Promise}
   * @memberof MaterialList
   */
  async addListMaterial({ listId = "default", materialId } = {}) {
    if (!materialId) {
      throw Error("materialId must be specified");
    }
    await fetch(`${this.baseUrl}/list/${listId}/${materialId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  /**
   * Delete material from list.
   *
   * @param {object} options
   * @param {string} options.listId
   * @param {string} options.materialId
   * @returns {Promise}
   * @memberof MaterialList
   */
  async deleteListMaterial({ listId = "default", materialId } = {}) {
    if (!materialId) {
      throw Error("materialId must be specified");
    }
    await fetch(`${this.baseUrl}/list/${listId}/${materialId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
}

export default MaterialList;