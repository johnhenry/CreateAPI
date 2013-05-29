#Create API
##Library for Creating APIs that connect asynchronously to APIs on the web. 
Can be used in both client-side and server-side applications.
Note : This is a very "Meta" library -- the ideal usage is to create libraries for use in other libraries...
### Installation
#### Node
```
    $ npm install create-api
```
```js
    var CreateAPI = require('create-api');
```

#### Browser
```html
   <script src="./lib/CreateAPI.js" ></script>
   <!--Henceforth, you may access the global CreateAPI object...-->
```
### Usage - CreateAPI.Get(api[,efforFunc])
CreateAPI.Get takes two arguments -- api and efforFunc
#### api - an object defined with the following members:

    * api.url (required) - HTTP GET url of the web accessable api
    * api.dataDefault (optional) - Object containig default parameters to be passed to the api
    * api.dataRequired (optional) - Object containig required parameters. these will overwite any other parameters passed
    * api.transformResponse (optional) - function or array of functions used to transform final response -- should be used in conjunction with api.dataRequired in order to produce desired results

#### errorFunc (optional) - function to be called in case of request error

    errorFunc is passed a single error parameter

#### CreateAPI.Get -> function(parameters,callback,faulure)

CreateAPI.Get returns a function that takes up to three arguments -- parameters, callback, failure
    
    parameters (optional) - Object containing parameters to be passed to api e.g.  {a:1,b:2} <===> ...?a=1&b=2
    * callback (optional) - function to be called upon response
        callback is passed three parameters:
            * result - the transformed response
            * data - the raw response -- note: this object's type will depend upon the environment (browser or node)
            * http - the http object handling the response -- note: this object's type will depend upon the environment
    * failure (optional) - function to be called upon response
        failure is passed three parameters
            * error - the error
            * data - any raw data
            * http - the http object handling the response

#### Example
    The Following creates a function that accesses Random.org's random integers API

```js
    //Used to transform result
    var plain_to_array = function(str){
        return str.split("\n").filter(function(str){return str!==""});
    }
    //Used to transform result
    var map_string_to_int_10 = function(str){
        return str.map(function(str){return parseInt(str,10)});
    }
    var RandInt = CreateAPI.Get({
        url:"http://www.random.org/integers",
        dataDefault:{
            min:0,  
            max:10,
            num:10,
            base:10,
            rnd:"new"
        },
        dataRequired:{
            format:"plain",
            col:1
        },
        transformResponse:[plain_to_array,map_string_to_int_10]
    })
    var i;
    RandInt({min:5,max:42},function(result){i = result;console.log(i);}) //asyncronously sets i to a random integer and logs it
```

### Usage - CreateAPI.Create(api_list,obj,errorFuncByName)
CreateAPI.Create provides a simple way to create an object that conviniently holds a set of APIs
It takes three arguments -- api_list, obj, and errorFuncByName

    * api_list (required) - Object containing apis (as defined above for CreateAPI.Get). Keys are be used as function names in resulting api object.
    * obj (optional) - Object into which api functions will be added as methods. If this object is not given, CreateAPI.Create will return a new object.
    * errorFuncByName (optional) - Function that takes the name of the functions from api_list and returns an error function to be used with said function

#### Example

Please see [https://github.com/johnhenry/RandomOrgAPI](https://github.com/johnhenry/RandomOrgAPI) for a concrete example

## License

(The MIT License)

Copyright (c) 2013 John Henry &lt;john@iamjohnhenry.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.