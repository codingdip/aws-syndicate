import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


export const handler = async (event) => {
    console.log(event);
    const currentDate = new Date();

    const putRequests = event.Records.map((record)=> {
        
        console.log(record.dynamodb);
        var item = {
            id: uuidv4(),
            modificationTime: currentDate.toISOString(),
            itemKey: record.dynamodb.Keys.key.S
        }

        if (record.eventName === 'INSERT') {
            item.newValue = {
                key: record.dynamodb.Keys.key.S,
                value: Number(record.dynamodb.NewImage.value.N)
            };
        } else {
            Object.assign(item, {
                updatedAttribute: 'value',
                oldValue: Number(record.dynamodb.OldImage.value.N),
                newValue: Number(record.dynamodb.NewImage.value.N)
            });
        }
        var putRequest = {
            PutRequest: {
              Item: item
            }
        };

        return putRequest;

    });

    const command = new BatchWriteCommand({
        RequestItems: {
          [process.env.target_table]: putRequests
        },
      });

    const putResponse = await docClient.send(command);
    console.log(putResponse);
};