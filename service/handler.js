"use strict";

module.exports.compute = async (event, context) => {
  const requestId = event.pathParameters.requestId;
  const body = JSON.parse(event.body);
  return getResponse({ ...body, requestId });
};

const getResponse = input =>
  isInputValid(input)
    ? getSuccessfulResponse(getParsedResult(input), input.requestId)
    : getErrorResponse();

const isInputValid = input =>
  input &&
  "data" in input &&
  "0" in input.data &&
  "1" in input.data &&
  "values" in input.data[0] &&
  "values" in input.data[1] &&
  Array.isArray(input.data[0].values) &&
  Array.isArray(input.data[1].values) &&
  input.data[0].values.some(n => typeof n === "number") &&
  input.data[1].values.some(n => typeof n === "number") &&
  input.data[0].values.length === 6 &&
  input.data[1].values.length === 6;

const getParsedResult = input => {
  return {
    title: "Result",
    values: input.data[0].values.map(
      (value, i) => value - input.data[1].values[i]
    )
  };
};

const getSuccessfulResponse = (result, requestId) => ({
  statusCode: 200,
  body: JSON.stringify({
    request_id: requestId,
    timestamp: new Date().getTime(),
    result
  })
});

const getErrorResponse = () => ({
  statusCode: 400,
  body: JSON.stringify({
    message: "Please check docs for valid input"
  })
});
