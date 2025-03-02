import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


export const handler = async (event) => {
    console.log(event);

    const currentDate = new Date();

    const item = {
        id: uuidv4(),
        principalId: event.principalId,
        createdAt: currentDate.toISOString(),
        body: event.content
    }

    const command = new PutCommand({
        TableName : 'cmtr-58d26e25-Events-test',
        Item: item
    });

    const putResponse = await docClient.send(command);
    console.log(putResponse);
    const result = {
        event: putResponse
    }

    const response = {
        statusCode: 201,
        body: result
    };
    return response;

};