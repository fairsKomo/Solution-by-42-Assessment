import {Database} from "bun:sqlite";
import fs from 'fs';
import csvParser from 'csv-parser';
import * as validate from './zodvalidation';
import type { ZodError } from "zod";


export function getRecordCount(tableName: any, db: Database) {
    
    const query = `SELECT count(*) FROM ${tableName}`;
    const results : any= dbb.query(query).all();
    return results[0]["count(*)"];
};

export function retrieveCounts(db: Database){

    try {
        const tableRecords = {
            newLicenseRequest: getRecordCount('NewLicenseRequest', db),
            accountRequest: getRecordCount('AccountRequest', db),
            inspectionRequest: getRecordCount('InspectionRequest', db),
            addNewActivityRequest: getRecordCount('AddNewActivityRequest', db),
            stampLicenseLetterRequest: getRecordCount('StampLicenseLetterRequest', db),
            totalTime: 0,
        };

        return tableRecords;
    } catch (error) {
        console.error('Error fetching table records:', error);
    }

};


export function createTables(db: Database){

    db.run(`CREATE TABLE IF NOT EXISTS NewLicenseRequest (
      RequestID TEXT PRIMARY KEY,
      RequestStatus TEXT,
      CompanyName TEXT,
      LicenceType TEXT,
      IsOffice TEXT,
      OfficeName TEXT,
      OfficeServiceNumber TEXT,
      RequestDate TEXT,
      Activities TEXT
    )`);
  
    db.run(`CREATE TABLE IF NOT EXISTS AccountRequest (
      RequestID TEXT PRIMARY KEY,
      RequestStatus TEXT,
      CompanyName TEXT,
      RequesterName TEXT,
      ApplicantName TEXT,
      UserName TEXT,
      ContactEmail TEXT,
      Permissions TEXT
    )`);
  
    db.run(`CREATE TABLE IF NOT EXISTS InspectionRequest (
      RequestID TEXT PRIMARY KEY,
      RequestStatus TEXT,
      CompanyName TEXT,
      InspectionDate TEXT,
      InspectionTime TEXT,
      InspectionType TEXT
    )`);
  
    db.run(`CREATE TABLE IF NOT EXISTS AddNewActivityRequest (
      RequestID TEXT PRIMARY KEY,
      RequestStatus TEXT,
      CompanyName TEXT,
      LicenceID TEXT,
      Activities TEXT
    )`);
  
    db.run(`CREATE TABLE IF NOT EXISTS StampLicenseLetterRequest (
      RequestID TEXT PRIMARY KEY,
      RequestStatus TEXT,
      CompanyName TEXT,
      LicenceID TEXT,
      RequestDate TEXT
    )`);
}


export async function insertIntoDB(database: Database, data: any) {
    try {
        const newLicenseRequestStmt = database.prepare(`
            INSERT INTO NewLicenseRequest
            (RequestID, RequestStatus, CompanyName, LicenceType, IsOffice, OfficeName, OfficeServiceNumber, RequestDate, Activities)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const accountRequestStmt = database.prepare(`
            INSERT INTO AccountRequest
            (RequestID, RequestStatus, CompanyName, RequesterName, ApplicantName, UserName, ContactEmail, Permissions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const inspectionRequestStmt = database.prepare(`
            INSERT INTO InspectionRequest
            (RequestID, RequestStatus, CompanyName, InspectionDate, InspectionTime, InspectionType)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const addNewActivityRequestStmt = database.prepare(`
            INSERT INTO AddNewActivityRequest
            (RequestID, RequestStatus, CompanyName, LicenceID, Activities)
            VALUES (?, ?, ?, ?, ?)
        `);

        const stampLicenseLetterRequestStmt = database.prepare(`
            INSERT INTO StampLicenseLetterRequest
            (RequestID, RequestStatus, CompanyName, LicenceID, RequestDate)
            VALUES (?, ?, ?, ?, ?)
        `);

        const insertions = database.transaction(requests =>{
            for (const request of requests.newLicenseRequest) {
                newLicenseRequestStmt.run(
                    request.RequestID,
                    request.RequestStatus,
                    request.RequestData.CompanyName,
                    request.RequestData.LicenceType,
                    request.RequestData.IsOffice,
                    request.RequestData.OfficeName,
                    request.RequestData.OfficeServiceNumber,
                    request.RequestData.RequestDate,
                    request.RequestData.Activities
                );
            }
    
            for (const request of requests.accountRequest) {
                accountRequestStmt.run(
                    request.RequestID,
                    request.RequestStatus,
                    request.RequestData.CompanyName,
                    request.RequestData.RequesterName,
                    request.RequestData.ApplicantName,
                    request.RequestData.UserName,
                    request.RequestData.ContactEmail,
                    request.RequestData.Permissions.toString(),
                );
            }
    
            for (const request of requests.inspectionRequest) {
                inspectionRequestStmt.run(
                    request.RequestID,
                    request.RequestStatus,
                    request.RequestData.CompanyName,
                    request.RequestData.InspectionDate,
                    request.RequestData.InspectionTime,
                    request.RequestData.InspectionType,
                );
            }
    
            for (const request of requests.addNewActivityRequest) {
                addNewActivityRequestStmt.run(
                    request.RequestID,
                    request.RequestStatus,
                    request.RequestData.CompanyName,
                    request.RequestData.LicenceID,
                    request.RequestData.Activities.toString(),
                );
            }
    
            for (const request of requests.stampLicenseLetterRequest) {
                stampLicenseLetterRequestStmt.run(
                    request.RequestID,
                    request.RequestStatus,
                    request.RequestData.CompanyName,
                    request.RequestData.LicenceID,
                    request.RequestData.RequestDate,
                );
            }
        })

        
        const count: number = insertions(data);
        console.log(`${count} record was inserted succefully!`);
    } catch (error) {
        console.error("Error inserting data:", error);
        // Handle error as per your requirement
    }
} 

export async function processCSV(csvFilePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
      const categorizedData: any = {
          newLicenseRequest: [],
          accountRequest: [],
          inspectionRequest: [],
          addNewActivityRequest: [],
          stampLicenseLetterRequest: []
      };

      fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (rowData: any) => {
            const { RequestID, RequestType, RequestStatus, RequestData } = rowData;
            const requestData = JSON.parse(RequestData);
            const rowDataObj = {
                RequestID,
                RequestStatus,
                RequestData: requestData
            };
                
            
            try{
                switch (RequestType) {
                    case '1':
                        if (validate.validateLicense(rowDataObj)) {
                            categorizedData.newLicenseRequest.push(rowDataObj);
                        }
                        break;
                    case '2':
                        if (validate.validateAccount(rowDataObj)) {
                            categorizedData.accountRequest.push(rowDataObj);
                        }
                        break;
                    case '3':
                        if (validate.validateInspection(rowDataObj)) {
                            categorizedData.inspectionRequest.push(rowDataObj);
                        }
                        break;
                    case '4':
                        if (validate.validateAddNewActivity(rowDataObj)) {
                            categorizedData.addNewActivityRequest.push(rowDataObj);
                        }
                        break;
                    case '5':
                        if (validate.validateStampLicenseLetter(rowDataObj)) {
                            categorizedData.stampLicenseLetterRequest.push(rowDataObj);
                        }
                        break;
                    default:
                        break;
                }
            } catch(error: any){
                console.log("Improper format of data", error.message);
                
            }

        })
        .on('end', () => {
            resolve(categorizedData);
        })
        .on('error', (error: any) => {
            console.error("Error reading CSV file:", error);
            reject(error); // Reject the Promise with the error
        });
});
}
const dbb = new Database('myDatabase.sqlite');
