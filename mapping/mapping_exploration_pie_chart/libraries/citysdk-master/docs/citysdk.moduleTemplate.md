# Global





* * *

## Class: ModuleTemplateModule
Instantiates an instance of the CitySDK FEMA object.

### ModuleTemplateModule.enable(apiKey) 

Enable function. Stores the API key for this module and sets it as enabled.  It will also compare the CitySDK core's version number to the minimum number required as specified for this module.

**Parameters**

**apiKey**: `string`, The census API key.

**Returns**: `boolean`, True if enabled, false if not enabled.

### ModuleTemplateModule.APIRequest(request, callback) 

Call which returns disaster listings from the DisasterDeclarationsSumamries Dataset

**Parameters**

**request**: `object`, <pre><code>{

**callback**: `function`, Call which returns disaster listings from the DisasterDeclarationsSumamries Dataset

**Returns**: `object`, <pre><code>{



* * *







**Overview:** This is a template that module builders can use to make new modules.

