import { Constants } from "./Constants";

const baseUrl = `${Constants.domainUrl}`;
export const Apis = {
  login: `${baseUrl}login`,
  changePassword: `${baseUrl}changePassword`,
  getAllUsers: `${baseUrl}users`,
  createUser: `${baseUrl}createUser`,
  createOrg: `${baseUrl}createOrg`,
  getOrganizations: `${baseUrl}organizations`,
  getOrgUsers: `${baseUrl}orgUsers/`,
  getClassification: `${baseUrl}classification`,
  getPrecedence: `${baseUrl}precedence`,
  getEnvelopSize: `${baseUrl}envelopSize`,
  sendLetter: `${baseUrl}sendLetter`,
  getLetters: `${baseUrl}Letters`,
  trackLetter: `${baseUrl}trackLetter/`,
  markLetterReceived: `${baseUrl}markLetterReceived`,
  forwardLetter: `${baseUrl}forwardLetter`,
  sendBatch: `${baseUrl}sendBatch`,
  trackBatch: `${baseUrl}trackBatch/`,
  markBatchReceived: `${baseUrl}markBatchReceived`,
  forwardBatch: `${baseUrl}forwardBatch`,
};