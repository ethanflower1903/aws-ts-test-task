'use strict';

// tests for findAll
// Generated by serverless-jest-plugin

import {APIGatewayProxyResult} from "aws-lambda";
import {handler} from '../../src/point/point.index';
import {handler as measurementHandler} from '../../src/measurement/measurement.index';
import * as jestPlugin from 'serverless-jest-plugin';
import {isApiGatewayResponse} from '../../src/testUtils/validators';
import eventGenerator from "../../src/testUtils/eventGenerator";

const wrapped = jestPlugin.lambdaWrapper.wrap(handler, { handler: 'findAll' });

describe('findAll', () => {
	beforeAll((done) => {
		done();
	});

	it('should return a 200 whit the list of points', async () => {
		const measurementParams = eventGenerator.APIGatewayRequest(
			{
				body: {
					name: 'test',
				}
			}
		);
		const result = await measurementHandler.create(measurementParams);
		const measurement = JSON.parse(result.body);

		const points = eventGenerator.APIGatewayRequest(
			{
				body: [
					{
						x: 1,
						y: 1,
						z: 1,
						accuracy: 1,
					}
				],
				pathParametersObject: {
					measurementId: measurement.data.id,
				},
			}
		);
		await handler.create(points);

		const params = eventGenerator.APIGatewayRequest({
			pathParametersObject: {
				measurementId: measurement.data.id
			}
		});

		const response: APIGatewayProxyResult = await wrapped.run(params) as APIGatewayProxyResult;
		expect(response).toBeDefined();
		expect(response.statusCode).toBe(200);
		expect(isApiGatewayResponse(response)).toBe(true);

		const body = JSON.parse(response.body);
		expect(body.data[0]).toEqual({
			id: expect.any(String),
			x: expect.any(Number),
			y: expect.any(Number),
			z: expect.any(Number),
			accuracy: expect.any(Number),
			measurementId: measurement.data.id,
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});
});
