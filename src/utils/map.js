import { cloneDeep } from "lodash";

/**
 * @param {object} product
 * @param {array} categories
 * @returns {array} mapped products with categories
 */
export const mapCategories = (products, categories) => {
  let allProducts = cloneDeep(products);
  let newArr = [];
  for (let i = 0; i < allProducts.category.length; i++) {
    let obj = categories.find((item) => item.id === allProducts.category[i]);
    if (obj) {
      newArr.push(obj);
    }
  }
  allProducts.category = [...newArr];
  return allProducts;
};

/**
 * @param {object} product
 * @param {array} occasions
 * @returns {array} mapped products with occasions
 */
export const mapOccasions = (products, occasions) => {
  let allProducts = cloneDeep(products);
  let newArr = [];
  for (let i = 0; i < allProducts.occasions.length; i++) {
    let obj = occasions.find((item) => item.id === allProducts.occasions[i]);
    if (obj) {
      newArr.push(obj);
    }
  }
  allProducts.occasions = [...newArr];
  return allProducts;
};

/**
 * @param {object} product
 * @param {array} interests
 * @returns {array} mapped products with interests
 */
export const mapInterests = (products, interests) => {
  let allProducts = cloneDeep(products);
  let newArr = [];
  for (let i = 0; i < allProducts.interests.length; i++) {
    let obj = interests.find((item) => item.id === allProducts.interests[i]);
    if (obj) {
      newArr.push(obj);
    }
  }
  allProducts.interests = [...newArr];
  return allProducts;
};

/**
 * @param {object} product
 * @param {array} recipients
 * @returns {array} mapped products with recipients
 */
export const mapRecipients = (products, recipients) => {
  let allProducts = cloneDeep(products);
  let newArr = [];
  for (let i = 0; i < allProducts.recipients.length; i++) {
    let obj = recipients.find((item) => item.id === allProducts.recipients[i]);
    if (obj) {
      newArr.push(obj);
    }
  }
  allProducts.recipients = [...newArr];
  return allProducts;
};
