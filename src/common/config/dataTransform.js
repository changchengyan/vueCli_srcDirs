export function dataTransform_pipeMsg(params){
        let temp_json = {};
        // console.log(params)
        temp_json.ID = params["ID"];
        temp_json.BUILD_DEPT = params["BUILD_DEPT"];
        temp_json.AREANAME = params["AREANAME"];
        temp_json.AREAID = params["AREAID"];
        temp_json.BUILD_DEPT = params["BUILD_DEPT"];
        temp_json.CODE = params["CODE"];
        temp_json.COMPANY_ID = params["COMPANY_ID"];
        temp_json.CONSTRUCTION_DEPT = params["CONSTRUCTION_DEPT"];
        temp_json.CREATE_TIME = params["CREATE_TIME"];
        temp_json.CREATE_USER = params["CREATE_USER"];
        temp_json.DESIGN_DEPT = params["DESIGN_DEPT"];
        temp_json.END_POINT = params["END_POINT"];
        temp_json.FLOW_THRESHOLD = params["FLOW_THRESHOLD"];
        temp_json.INSTALL_TIME = params["INSTALL_TIME"];
        temp_json.INTERFACE_TYPE = params["INTERFACE_TYPE"];
        temp_json.LOCATION = params["LOCATION"];
        temp_json.LOCATION_ID = params["LOCATION_ID"];
        temp_json.PIPELINE_CODE = params["PIPELINE_CODE"];
        temp_json.PIPELINE_NAME = params["PIPELINE_NAME"];
        temp_json.PIPE_LENGTH = params["PIPE_LENGTH"];
        temp_json.PIPE_MATERIAL = params["PIPE_MATERIAL"];
        temp_json.PIPE_NAME = params["PIPE_NAME"];
        temp_json.PIPE_RADIUS = params["PIPE_RADIUS"];
        temp_json.PIPE_THICKNESS = params["PIPE_THICKNESS"];
        temp_json.PRESSURE = params["PRESSURE"];
        temp_json.PRES_THRESHOLD = params["PRES_THRESHOLD"];
        temp_json.START_POINT = params["START_POINT"];
        temp_json.STATUS = params["STATUS"];
        temp_json.SUPERVISOR_DEPT = params["SUPERVISOR_DEPT"];
        temp_json.TEMPERRATURE = params["TEMPERRATURE"];
        temp_json.TRANS_MEDIUM = params["TRANS_MEDIUM"];
        temp_json.TYPE = params["TYPE"];
        temp_json.UPDATE_TIME = params["UPDATE_TIME"];
        temp_json.UPDATE_USER = params["UPDATE_USER"];
        temp_json.USE_YEAR = params["USE_YEAR"];
        return temp_json;
   
}