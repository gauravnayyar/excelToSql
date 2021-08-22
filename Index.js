const xlsxFile = require("read-excel-file/node");
const fs = require("fs");
const tableName = process.argv[2];
const FilePath = process.argv[3];
const config = require("./config.json");

validationOFProcess(tableName,FilePath)

function validationOFProcess(tableName,FilePath){
    if(tableName === undefined ||FilePath === undefined ) {
        if(!tableName){
        throw new Error("Table Name not Found. Please give table name or read Read.md");
        }
        if(!FilePath){
            throw new Error("FilePath not Found. Please give FilePath or read Read.md"); 
        }
    }
    else if(!config.hasOwnProperty(tableName)){
        throw new Error(" Table is not configured. Please configure it or read Read.md"); 
    }
    else {
        makeExcelRead(FilePath);
    }
}
//
// function getTableDetails(tableName) {
//     if (config.hasOwnProperty(tableName)) {
//         item = config[tableName];
//         console.log(item.ExcelTableColumn);
//     }
// }

async function makeExcelRead(FilePath) {
    try {
        await xlsxFile(FilePath).then((rows) => {
        //    if(ValidationOfSheet(rows[0]))
            for (let index = 1; index < rows.length; index++) {

                

              creatInsertQueryFile(rows[index],rows[0])
            
        }
        });
        console.log('File Created Successfully');
    } catch (error) {
        console.log(error);
    }
}

function ValidationOfSheet(column){
if(column.includes(null))
{
throw new Error(" One of the Column is empty/null/undefined. Please correct your excel Sheet");
}
}

async function creatInsertQueryFile(rows,column) {
    fs.writeFileSync('Transaction.sql', await getInsertQuery(rows,column), { flag: 'a+' }, err => {
        console.log(error);
    })
}

 function getInsertQuery(rows,column) {
    const tableDetails =config[tableName];
    return  getFomatQuery(rows,tableDetails.query,column);;
}

async function getFomatQuery(rows,query,column) {
      let tempstring =`${query}`;

      for (let index = 0; index < column.length; index++) {
         tempstring = await replaceString(tempstring,column[index],rows[index])
      }
  return tempstring;
}

function replaceString(string, mathcing, replaceString){  
return string.replace(mathcing,replaceString);
}



// "Insert into Item values('PPR Bend  200mm' ,(select top 1 id from  ItemCategory where Name='ItemCategoryName'),1,' ','PPR Bend  200mm', 'PPR Bend  200mm',  ' ',null,1,0,0,0,'{\"dummyMetaDataField\":null,\"specification":"PPR Bend  200mm\""}','VIPUL BHOJWANI ~ BH0011GB8321','2021-08-19 18:12:35.287',null,null)

// Insert into [dbo].[Item_HSNJunction] values ((Select top 1 id from Item order by 1 desc),3,'2021-08-19 18:04:18.107',null,'VIPUL BHOJWANI ~ BH0011GB8321','2021-08-19 18:04:18.107',NULL,NuLL)
// Insert into [dbo].[Org_Item_Mapping] values ( 3,(select top 1 id from Item order by 1 desc),1,'VIPUL BHOJWANI ~ BH0011GB8321','2021-08-20 22:55:42.060',NUll,Null)
// Insert into [dbo].[OrgItem_IssueType_Mapping] values ( 3,(select top 1 id from Item order by 1 desc),1,1,'VIPUL BHOJWANI ~ BH0011GB8321','2021-08-20 22:55:42.060',NUll,Null)
