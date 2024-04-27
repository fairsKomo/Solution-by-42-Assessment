import {z} from "zod";


export function validateLicense(record: any){

    const RequestDataSchema = z.object({
        CompanyName: z.string(),
        LicenceType: z.string(),
        IsOffice: z.boolean(),
        OfficeName: z.string(),
        OfficeServiceNumber: z.string(),
        RequestDate: z.string(),
        Activities: z.string()
    });
    
    const RequestSchema = z.object({
        RequestID: z.string(),
        RequestStatus: z.string(),
        RequestData: RequestDataSchema
    });

    try {
        RequestSchema.parse(record);
        return true;
    } catch (error) {
        console.error("Data schema is invalid:", error);
    }
}

export function validateAccount(record: any){

    const RequestDataSchema = z.object({
        CompanyName: z.string(),
        RequesterName: z.string(),
        ApplicantName: z.string(),
        UserName: z.string(),
        ContactEmail: z.string(),
        Permissions: z.array(z.string()),
    });
    
    const RequestSchema = z.object({
        RequestID: z.string(),
        RequestStatus: z.string(),
        RequestData: RequestDataSchema
    });

    try {
        RequestSchema.parse(record);
        return true    
    } catch (error) {
        console.error("Data schema is invalid:", error);
    }
}

export function validateInspection(record: any){

    const RequestDataSchema = z.object({
        CompanyName: z.string(),
        InspectionDate: z.string(),
        InspectionTime: z.string(),
        InspectionType: z.string(),
    });
    
    const RequestSchema = z.object({
        RequestID: z.string(),
        RequestStatus: z.string(),
        RequestData: RequestDataSchema
    });

    try {
        RequestSchema.parse(record);
        return true    
    } catch (error) {
        console.error("Data schema is invalid:", error);
    }
}

export function validateAddNewActivity(record: any){

    const RequestDataSchema = z.object({
        CompanyName: z.string(),
        LicenceID: z.string(),
        Activities: z.array(z.string()),
    });
    
    const RequestSchema = z.object({
        RequestID: z.string(),
        RequestStatus: z.string(),
        RequestData: RequestDataSchema
    });

    try {
        RequestSchema.parse(record);
        return true    
    } catch (error) {
        console.error("Data schema is invalid:", error);
    }
}

export function validateStampLicenseLetter(record: any){

    const RequestDataSchema = z.object({
        CompanyName: z.string(),
        LicenceID: z.string(),
        RequestDate: z.string(),
    });
    
    const RequestSchema = z.object({
        RequestID: z.string(),
        RequestStatus: z.string(),
        RequestData: RequestDataSchema
    });

    try {
        RequestSchema.parse(record);
        return true    
    } catch (error) {
        console.error("Data schema is invalid:", error);
    }
}

// validateLicense(
//     {
//         RequestID: "199",
//         RequestStatus: "1",
//         RequestData: {
//           CompanyName: "Keebler Group",
//           LicenceType: "Personal",
//           IsOffice: null,
//           OfficeName: "Marketing",
//           OfficeServiceNumber: "434-629-0310",
//           RequestDate: "18/2/2022",
//           Activities: "GNLQaOuM86",
//         }
// })