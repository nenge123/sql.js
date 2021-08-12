
// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
// https://github.com/kripken/emscripten/issues/5820
// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
// which is able to be used/called before the WASM is loaded.
// The modularization below exports a promise that loads and resolves to the actual sql.js module.
// That way, this module can't be used before the WASM is finished loading.

// We are going to define a function that a user will call to start loading initializing our Sql.js library
// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
// Instead, we want to return the previously loaded module

// TODO: Make this not declare a global if used in the browser
var initSqlJsPromise = undefined;

var initSqlJs = function (moduleConfig) {

    if (initSqlJsPromise){
      return initSqlJsPromise;
    }
    // If we're here, we've never called this function before
    initSqlJsPromise = new Promise(function (resolveModule, reject) {

        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
        // https://github.com/kripken/emscripten/issues/5820

        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
        // properties to it, like `preRun`, `postRun`, etc
        // We are using that to get notified when the WASM has finished loading.
        // Only then will we return our promise

        // If they passed in a moduleConfig object, use that
        // Otherwise, initialize Module to the empty object
        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {};

        // EMCC only allows for a single onAbort function (not an array of functions)
        // So if the user defined their own onAbort function, we remember it and call it
        var originalOnAbortFunction = Module['onAbort'];
        Module['onAbort'] = function (errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction){
              originalOnAbortFunction(errorThatCausedAbort);
            }
        };

        Module['postRun'] = Module['postRun'] || [];
        Module['postRun'].push(function () {
            // When Emscripted calls postRun, this promise resolves with the built Module
            resolveModule(Module);
        });

        // There is a section of code in the emcc-generated code below that looks like this:
        // (Note that this is lowercase `module`)
        // if (typeof module !== 'undefined') {
        //     module['exports'] = Module;
        // }
        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
        // but that carries with it additional unnecessary baggage/bugs we don't want either.
        // So, we have three options:
        // 1) We undefine `module`
        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
        // 3) We write a script to remove those lines of code as part of the Make process.
        //
        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
        // That's a nice side effect since we're handling the modularization efforts ourselves
        module = undefined;

        // The emcc-generated code and shell-post.js code goes below,
        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort

var e;e||(e=typeof Module !== 'undefined' ? Module : {});null;
e.onRuntimeInitialized=function(){function a(g,l){this.Ra=g;this.db=l;this.Pa=1;this.lb=[]}function b(g,l){this.db=l;l=ba(g)+1;this.eb=ca(l);if(null===this.eb)throw Error("Unable to allocate memory for the SQL string");k(g,m,this.eb,l);this.jb=this.eb;this.$a=this.pb=null}function c(g){this.filename="dbfile_"+(4294967295*Math.random()>>>0);if(null!=g){var l=this.filename,q=l?r("//"+l):"/";l=da(!0,!0);q=ea(q,(void 0!==l?l:438)&4095|32768,0);if(g){if("string"===typeof g){for(var p=Array(g.length),z=
0,M=g.length;z<M;++z)p[z]=g.charCodeAt(z);g=p}fa(q,l|146);p=u(q,"w");ha(p,g,0,g.length,0,void 0);ia(p);fa(q,l)}}this.handleError(h(this.filename,d));this.db=x(d,"i32");oc(this.db);this.fb={};this.Xa={}}var d=y(4),f=e.cwrap,h=f("sqlite3_open","number",["string","number"]),n=f("sqlite3_close_v2","number",["number"]),t=f("sqlite3_exec","number",["number","string","number","number","number"]),w=f("sqlite3_changes","number",["number"]),v=f("sqlite3_prepare_v2","number",["number","string","number","number",
"number"]),C=f("sqlite3_sql","string",["number"]),H=f("sqlite3_normalized_sql","string",["number"]),Z=f("sqlite3_prepare_v2","number",["number","number","number","number","number"]),pc=f("sqlite3_bind_text","number",["number","number","number","number","number"]),pb=f("sqlite3_bind_blob","number",["number","number","number","number","number"]),qc=f("sqlite3_bind_double","number",["number","number","number"]),rc=f("sqlite3_bind_int","number",["number","number","number"]),sc=f("sqlite3_bind_parameter_index",
"number",["number","string"]),tc=f("sqlite3_step","number",["number"]),uc=f("sqlite3_errmsg","string",["number"]),vc=f("sqlite3_column_count","number",["number"]),wc=f("sqlite3_data_count","number",["number"]),xc=f("sqlite3_column_double","number",["number","number"]),qb=f("sqlite3_column_text","string",["number","number"]),yc=f("sqlite3_column_blob","number",["number","number"]),zc=f("sqlite3_column_bytes","number",["number","number"]),Ac=f("sqlite3_column_type","number",["number","number"]),Bc=
f("sqlite3_column_name","string",["number","number"]),Cc=f("sqlite3_reset","number",["number"]),Dc=f("sqlite3_clear_bindings","number",["number"]),Ec=f("sqlite3_finalize","number",["number"]),Fc=f("sqlite3_create_function_v2","number","number string number number number number number number number".split(" ")),Gc=f("sqlite3_value_type","number",["number"]),Hc=f("sqlite3_value_bytes","number",["number"]),Ic=f("sqlite3_value_text","string",["number"]),Jc=f("sqlite3_value_blob","number",["number"]),
Kc=f("sqlite3_value_double","number",["number"]),Lc=f("sqlite3_result_double","",["number","number"]),rb=f("sqlite3_result_null","",["number"]),Mc=f("sqlite3_result_text","",["number","string","number","number"]),Nc=f("sqlite3_result_blob","",["number","number","number","number"]),Oc=f("sqlite3_result_int","",["number","number"]),sb=f("sqlite3_result_error","",["number","string","number"]),oc=f("RegisterExtensionFunctions","number",["number"]);a.prototype.bind=function(g){if(!this.Ra)throw"Statement closed";
this.reset();return Array.isArray(g)?this.Eb(g):null!=g&&"object"===typeof g?this.Fb(g):!0};a.prototype.step=function(){if(!this.Ra)throw"Statement closed";this.Pa=1;var g=tc(this.Ra);switch(g){case 100:return!0;case 101:return!1;default:throw this.db.handleError(g);}};a.prototype.zb=function(g){null==g&&(g=this.Pa,this.Pa+=1);return xc(this.Ra,g)};a.prototype.Jb=function(g){null==g&&(g=this.Pa,this.Pa+=1);g=qb(this.Ra,g);if("function"!==typeof BigInt)throw Error("BigInt is not supported");return BigInt(g)};
a.prototype.Kb=function(g){null==g&&(g=this.Pa,this.Pa+=1);return qb(this.Ra,g)};a.prototype.getBlob=function(g){null==g&&(g=this.Pa,this.Pa+=1);var l=zc(this.Ra,g);g=yc(this.Ra,g);for(var q=new Uint8Array(l),p=0;p<l;p+=1)q[p]=A[g+p];return q};a.prototype.get=function(g,l){l=l||{};null!=g&&this.bind(g)&&this.step();g=[];for(var q=wc(this.Ra),p=0;p<q;p+=1)switch(Ac(this.Ra,p)){case 1:var z=l.useBigInt?this.Jb(p):this.zb(p);g.push(z);break;case 2:g.push(this.zb(p));break;case 3:g.push(this.Kb(p));break;
case 4:g.push(this.getBlob(p));break;default:g.push(null)}return g};a.prototype.getColumnNames=function(){for(var g=[],l=vc(this.Ra),q=0;q<l;q+=1)g.push(Bc(this.Ra,q));return g};a.prototype.getAsObject=function(g,l){g=this.get(g,l);l=this.getColumnNames();for(var q={},p=0;p<l.length;p+=1)q[l[p]]=g[p];return q};a.prototype.getSQL=function(){return C(this.Ra)};a.prototype.getNormalizedSQL=function(){return H(this.Ra)};a.prototype.run=function(g){null!=g&&this.bind(g);this.step();return this.reset()};
a.prototype.ub=function(g,l){null==l&&(l=this.Pa,this.Pa+=1);g=ka(g);var q=la(g);this.lb.push(q);this.db.handleError(pc(this.Ra,l,q,g.length-1,0))};a.prototype.Db=function(g,l){null==l&&(l=this.Pa,this.Pa+=1);var q=la(g);this.lb.push(q);this.db.handleError(pb(this.Ra,l,q,g.length,0))};a.prototype.tb=function(g,l){null==l&&(l=this.Pa,this.Pa+=1);this.db.handleError((g===(g|0)?rc:qc)(this.Ra,l,g))};a.prototype.Gb=function(g){null==g&&(g=this.Pa,this.Pa+=1);pb(this.Ra,g,0,0,0)};a.prototype.vb=function(g,
l){null==l&&(l=this.Pa,this.Pa+=1);switch(typeof g){case "string":this.ub(g,l);return;case "number":this.tb(g,l);return;case "bigint":this.ub(g.toString(),l);return;case "boolean":this.tb(g+0,l);return;case "object":if(null===g){this.Gb(l);return}if(null!=g.length){this.Db(g,l);return}}throw"Wrong API use : tried to bind a value of an unknown type ("+g+").";};a.prototype.Fb=function(g){var l=this;Object.keys(g).forEach(function(q){var p=sc(l.Ra,q);0!==p&&l.vb(g[q],p)});return!0};a.prototype.Eb=function(g){for(var l=
0;l<g.length;l+=1)this.vb(g[l],l+1);return!0};a.prototype.reset=function(){return 0===Dc(this.Ra)&&0===Cc(this.Ra)};a.prototype.freemem=function(){for(var g;void 0!==(g=this.lb.pop());)ma(g)};a.prototype.free=function(){var g=0===Ec(this.Ra);delete this.db.fb[this.Ra];this.Ra=0;return g};b.prototype.next=function(){if(null===this.eb)return{done:!0};null!==this.$a&&(this.$a.free(),this.$a=null);if(!this.db.db)throw this.nb(),Error("Database closed");var g=na(),l=y(4);oa(d);oa(l);try{this.db.handleError(Z(this.db.db,
this.jb,-1,d,l));this.jb=x(l,"i32");var q=x(d,"i32");if(0===q)return this.nb(),{done:!0};this.$a=new a(q,this.db);this.db.fb[q]=this.$a;return{value:this.$a,done:!1}}catch(p){throw this.pb=B(this.jb),this.nb(),p;}finally{pa(g)}};b.prototype.nb=function(){ma(this.eb);this.eb=null};b.prototype.getRemainingSQL=function(){return null!==this.pb?this.pb:B(this.jb)};"function"===typeof Symbol&&"symbol"===typeof Symbol.iterator&&(b.prototype[Symbol.iterator]=function(){return this});c.prototype.run=function(g,
l){if(!this.db)throw"Database closed";if(l){g=this.prepare(g,l);try{g.step()}finally{g.free()}}else this.handleError(t(this.db,g,0,0,d));return this};c.prototype.exec=function(g,l,q){if(!this.db)throw"Database closed";var p=na(),z=null;try{var M=ba(g)+1,G=y(M);k(g,A,G,M);var ja=G;var aa=y(4);for(g=[];0!==x(ja,"i8");){oa(d);oa(aa);this.handleError(Z(this.db,ja,-1,d,aa));var D=x(d,"i32");ja=x(aa,"i32");if(0!==D){M=null;z=new a(D,this);for(null!=l&&z.bind(l);z.step();)null===M&&(M={columns:z.getColumnNames(),
values:[]},g.push(M)),M.values.push(z.get(null,q));z.free()}}return g}catch(N){throw z&&z.free(),N;}finally{pa(p)}};c.prototype.each=function(g,l,q,p,z){"function"===typeof l&&(p=q,q=l,l=void 0);g=this.prepare(g,l);try{for(;g.step();)q(g.getAsObject(null,z))}finally{g.free()}if("function"===typeof p)return p()};c.prototype.prepare=function(g,l){oa(d);this.handleError(v(this.db,g,-1,d,0));g=x(d,"i32");if(0===g)throw"Nothing to prepare";var q=new a(g,this);null!=l&&q.bind(l);return this.fb[g]=q};c.prototype.iterateStatements=
function(g){return new b(g,this)};c.prototype["export"]=function(){Object.values(this.fb).forEach(function(l){l.free()});Object.values(this.Xa).forEach(qa);this.Xa={};this.handleError(n(this.db));var g=ra(this.filename);this.handleError(h(this.filename,d));this.db=x(d,"i32");return g};c.prototype.close=function(){null!==this.db&&(Object.values(this.fb).forEach(function(g){g.free()}),Object.values(this.Xa).forEach(qa),this.Xa={},this.handleError(n(this.db)),sa("/"+this.filename),this.db=null)};c.prototype.handleError=
function(g){if(0===g)return null;g=uc(this.db);throw Error(g);};c.prototype.getRowsModified=function(){return w(this.db)};c.prototype.create_function=function(g,l){Object.prototype.hasOwnProperty.call(this.Xa,g)&&(ta(this.Xa[g]),delete this.Xa[g]);var q=ua(function(p,z,M){for(var G,ja=[],aa=0;aa<z;aa+=1){var D=x(M+4*aa,"i32"),N=Gc(D);if(1===N||2===N)D=Kc(D);else if(3===N)D=Ic(D);else if(4===N){N=D;D=Hc(N);N=Jc(N);for(var xb=new Uint8Array(D),Ea=0;Ea<D;Ea+=1)xb[Ea]=A[N+Ea];D=xb}else D=null;ja.push(D)}try{G=
l.apply(null,ja)}catch(Rc){sb(p,Rc,-1);return}switch(typeof G){case "boolean":Oc(p,G?1:0);break;case "number":Lc(p,G);break;case "string":Mc(p,G,-1,-1);break;case "object":null===G?rb(p):null!=G.length?(z=la(G),Nc(p,z,G.length,-1),ma(z)):sb(p,"Wrong API use : tried to return a value of an unknown type ("+G+").",-1);break;default:rb(p)}});this.Xa[g]=q;this.handleError(Fc(this.db,g,l.length,1,0,q,0,0,0));return this};e.Database=c};var va={},E;for(E in e)e.hasOwnProperty(E)&&(va[E]=e[E]);
var wa="./this.program",xa=!1,ya=!1,za=!1,Aa=!1;xa="object"===typeof window;ya="function"===typeof importScripts;za="object"===typeof process&&"object"===typeof process.versions&&"string"===typeof process.versions.node;Aa=!xa&&!za&&!ya;var F="",Ba,Ca,Da,Fa;
if(za)F=ya?require("path").dirname(F)+"/":__dirname+"/",Ba=function(a,b){Da||(Da=require("fs"));Fa||(Fa=require("path"));a=Fa.normalize(a);return Da.readFileSync(a,b?null:"utf8")},Ca=function(a){a=Ba(a,!0);a.buffer||(a=new Uint8Array(a));assert(a.buffer);return a},1<process.argv.length&&(wa=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),"undefined"!==typeof module&&(module.exports=e),e.inspect=function(){return"[Emscripten Module object]"};else if(Aa)"undefined"!=typeof read&&(Ba=function(a){return read(a)}),
Ca=function(a){if("function"===typeof readbuffer)return new Uint8Array(readbuffer(a));a=read(a,"binary");assert("object"===typeof a);return a},"undefined"!==typeof print&&("undefined"===typeof console&&(console={}),console.log=print,console.warn=console.error="undefined"!==typeof printErr?printErr:print);else if(xa||ya)ya?F=self.location.href:document.currentScript&&(F=document.currentScript.src),F=0!==F.indexOf("blob:")?F.substr(0,F.lastIndexOf("/")+1):"",Ba=function(a){var b=new XMLHttpRequest;
b.open("GET",a,!1);b.send(null);return b.responseText},ya&&(Ca=function(a){var b=new XMLHttpRequest;b.open("GET",a,!1);b.responseType="arraybuffer";b.send(null);return new Uint8Array(b.response)});var Ga=e.print||console.log.bind(console),I=e.printErr||console.warn.bind(console);for(E in va)va.hasOwnProperty(E)&&(e[E]=va[E]);va=null;e.thisProgram&&(wa=e.thisProgram);var Ha=[],Ia;function ta(a){Ia.delete(Ja.get(a));Ha.push(a)}
function ua(a){var b=Ja;if(!Ia){Ia=new WeakMap;for(var c=0;c<b.length;c++){var d=b.get(c);d&&Ia.set(d,c)}}if(Ia.has(a))a=Ia.get(a);else{if(Ha.length)c=Ha.pop();else{c=b.length;try{b.grow(1)}catch(n){if(!(n instanceof RangeError))throw n;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";}}try{b.set(c,a)}catch(n){if(!(n instanceof TypeError))throw n;if("function"===typeof WebAssembly.Function){var f={i:"i32",j:"i64",f:"f32",d:"f64"},h={parameters:[],results:[]};for(d=1;4>d;++d)h.parameters.push(f["viii"[d]]);
d=new WebAssembly.Function(h,a)}else{f=[1,0,1,96];h={i:127,j:126,f:125,d:124};f.push(3);for(d=0;3>d;++d)f.push(h["iii"[d]]);f.push(0);f[1]=f.length-2;d=new Uint8Array([0,97,115,109,1,0,0,0].concat(f,[2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0]));d=new WebAssembly.Module(d);d=(new WebAssembly.Instance(d,{e:{f:a}})).exports.f}b.set(c,d)}Ia.set(a,c);a=c}return a}function qa(a){ta(a)}var Ka;e.wasmBinary&&(Ka=e.wasmBinary);var noExitRuntime;e.noExitRuntime&&(noExitRuntime=e.noExitRuntime);
"object"!==typeof WebAssembly&&J("no native wasm support detected");
function oa(a){var b="i32";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":A[a>>0]=0;break;case "i8":A[a>>0]=0;break;case "i16":La[a>>1]=0;break;case "i32":K[a>>2]=0;break;case "i64":L=[0,(O=0,1<=+Math.abs(O)?0<O?(Math.min(+Math.floor(O/4294967296),4294967295)|0)>>>0:~~+Math.ceil((O-+(~~O>>>0))/4294967296)>>>0:0)];K[a>>2]=L[0];K[a+4>>2]=L[1];break;case "float":Ma[a>>2]=0;break;case "double":Na[a>>3]=0;break;default:J("invalid type for setValue: "+b)}}
function x(a,b){b=b||"i8";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":return A[a>>0];case "i8":return A[a>>0];case "i16":return La[a>>1];case "i32":return K[a>>2];case "i64":return K[a>>2];case "float":return Ma[a>>2];case "double":return Na[a>>3];default:J("invalid type for getValue: "+b)}return null}var Oa,Ja,Pa=!1;function assert(a,b){a||J("Assertion failed: "+b)}function Qa(a){var b=e["_"+a];assert(b,"Cannot call unknown function "+a+", make sure it is exported");return b}
function Ra(a,b,c,d){var f={string:function(v){var C=0;if(null!==v&&void 0!==v&&0!==v){var H=(v.length<<2)+1;C=y(H);k(v,m,C,H)}return C},array:function(v){var C=y(v.length);A.set(v,C);return C}},h=Qa(a),n=[];a=0;if(d)for(var t=0;t<d.length;t++){var w=f[c[t]];w?(0===a&&(a=na()),n[t]=w(d[t])):n[t]=d[t]}c=h.apply(null,n);c=function(v){return"string"===b?B(v):"boolean"===b?!!v:v}(c);0!==a&&pa(a);return c}var Sa=0,Ta=1;
function la(a){var b=Sa==Ta?y(a.length):ca(a.length);a.subarray||a.slice?m.set(a,b):m.set(new Uint8Array(a),b);return b}var Ua="undefined"!==typeof TextDecoder?new TextDecoder("utf8"):void 0;
function Va(a,b,c){var d=b+c;for(c=b;a[c]&&!(c>=d);)++c;if(16<c-b&&a.subarray&&Ua)return Ua.decode(a.subarray(b,c));for(d="";b<c;){var f=a[b++];if(f&128){var h=a[b++]&63;if(192==(f&224))d+=String.fromCharCode((f&31)<<6|h);else{var n=a[b++]&63;f=224==(f&240)?(f&15)<<12|h<<6|n:(f&7)<<18|h<<12|n<<6|a[b++]&63;65536>f?d+=String.fromCharCode(f):(f-=65536,d+=String.fromCharCode(55296|f>>10,56320|f&1023))}}else d+=String.fromCharCode(f)}return d}function B(a,b){return a?Va(m,a,b):""}
function k(a,b,c,d){if(!(0<d))return 0;var f=c;d=c+d-1;for(var h=0;h<a.length;++h){var n=a.charCodeAt(h);if(55296<=n&&57343>=n){var t=a.charCodeAt(++h);n=65536+((n&1023)<<10)|t&1023}if(127>=n){if(c>=d)break;b[c++]=n}else{if(2047>=n){if(c+1>=d)break;b[c++]=192|n>>6}else{if(65535>=n){if(c+2>=d)break;b[c++]=224|n>>12}else{if(c+3>=d)break;b[c++]=240|n>>18;b[c++]=128|n>>12&63}b[c++]=128|n>>6&63}b[c++]=128|n&63}}b[c]=0;return c-f}
function ba(a){for(var b=0,c=0;c<a.length;++c){var d=a.charCodeAt(c);55296<=d&&57343>=d&&(d=65536+((d&1023)<<10)|a.charCodeAt(++c)&1023);127>=d?++b:b=2047>=d?b+2:65535>=d?b+3:b+4}return b}function Wa(a){var b=ba(a)+1,c=ca(b);c&&k(a,A,c,b);return c}var Xa,A,m,La,K,Ma,Na;
function Ya(a){Xa=a;e.HEAP8=A=new Int8Array(a);e.HEAP16=La=new Int16Array(a);e.HEAP32=K=new Int32Array(a);e.HEAPU8=m=new Uint8Array(a);e.HEAPU16=new Uint16Array(a);e.HEAPU32=new Uint32Array(a);e.HEAPF32=Ma=new Float32Array(a);e.HEAPF64=Na=new Float64Array(a)}var Za=e.INITIAL_MEMORY||16777216;e.wasmMemory?Oa=e.wasmMemory:Oa=new WebAssembly.Memory({initial:Za/65536,maximum:32768});Oa&&(Xa=Oa.buffer);Za=Xa.byteLength;Ya(Xa);var $a=[],ab=[],bb=[],cb=[];
function db(){var a=e.preRun.shift();$a.unshift(a)}var eb=0,fb=null,gb=null;e.preloadedImages={};e.preloadedAudios={};function J(a){if(e.onAbort)e.onAbort(a);I(a);Pa=!0;throw new WebAssembly.RuntimeError("abort("+a+"). Build with -s ASSERTIONS=1 for more info.");}function hb(a){var b=ib;return String.prototype.startsWith?b.startsWith(a):0===b.indexOf(a)}function jb(){return hb("data:application/octet-stream;base64,")}var ib="sql-wasm.wasm";
if(!jb()){var kb=ib;ib=e.locateFile?e.locateFile(kb,F):F+kb}function lb(){try{if(Ka)return new Uint8Array(Ka);if(Ca)return Ca(ib);throw"both async and sync fetching of the wasm failed";}catch(a){J(a)}}function mb(){return Ka||!xa&&!ya||"function"!==typeof fetch||hb("file://")?Promise.resolve().then(lb):fetch(ib,{credentials:"same-origin"}).then(function(a){if(!a.ok)throw"failed to load wasm binary file at '"+ib+"'";return a.arrayBuffer()}).catch(function(){return lb()})}var O,L;
function nb(a){for(;0<a.length;){var b=a.shift();if("function"==typeof b)b(e);else{var c=b.Ib;"number"===typeof c?void 0===b.mb?Ja.get(c)():Ja.get(c)(b.mb):c(void 0===b.mb?null:b.mb)}}}function ob(a){return a.replace(/\b_Z[\w\d_]+/g,function(b){return b===b?b:b+" ["+b+"]"})}
function tb(){function a(h){return(h=h.toTimeString().match(/\(([A-Za-z ]+)\)$/))?h[1]:"GMT"}if(!ub){ub=!0;K[vb()>>2]=60*(new Date).getTimezoneOffset();var b=(new Date).getFullYear(),c=new Date(b,0,1);b=new Date(b,6,1);K[wb()>>2]=Number(c.getTimezoneOffset()!=b.getTimezoneOffset());var d=a(c),f=a(b);d=Wa(d);f=Wa(f);b.getTimezoneOffset()<c.getTimezoneOffset()?(K[yb()>>2]=d,K[yb()+4>>2]=f):(K[yb()>>2]=f,K[yb()+4>>2]=d)}}var ub;
function zb(a,b){for(var c=0,d=a.length-1;0<=d;d--){var f=a[d];"."===f?a.splice(d,1):".."===f?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c;c--)a.unshift("..");return a}function r(a){var b="/"===a.charAt(0),c="/"===a.substr(-1);(a=zb(a.split("/").filter(function(d){return!!d}),!b).join("/"))||b||(a=".");a&&c&&(a+="/");return(b?"/":"")+a}
function Ab(a){var b=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);a=b[0];b=b[1];if(!a&&!b)return".";b&&(b=b.substr(0,b.length-1));return a+b}function Bb(a){if("/"===a)return"/";a=r(a);a=a.replace(/\/$/,"");var b=a.lastIndexOf("/");return-1===b?a:a.substr(b+1)}function Cb(a){K[Db()>>2]=a}
function Eb(){if("object"===typeof crypto&&"function"===typeof crypto.getRandomValues){var a=new Uint8Array(1);return function(){crypto.getRandomValues(a);return a[0]}}if(za)try{var b=require("crypto");return function(){return b.randomBytes(1)[0]}}catch(c){}return function(){J("randomDevice")}}
function Fb(){for(var a="",b=!1,c=arguments.length-1;-1<=c&&!b;c--){b=0<=c?arguments[c]:"/";if("string"!==typeof b)throw new TypeError("Arguments to path.resolve must be strings");if(!b)return"";a=b+"/"+a;b="/"===b.charAt(0)}a=zb(a.split("/").filter(function(d){return!!d}),!b).join("/");return(b?"/":"")+a||"."}var Gb=[];function Hb(a,b){Gb[a]={input:[],output:[],cb:b};Ib(a,Jb)}
var Jb={open:function(a){var b=Gb[a.node.rdev];if(!b)throw new P(43);a.tty=b;a.seekable=!1},close:function(a){a.tty.cb.flush(a.tty)},flush:function(a){a.tty.cb.flush(a.tty)},read:function(a,b,c,d){if(!a.tty||!a.tty.cb.Ab)throw new P(60);for(var f=0,h=0;h<d;h++){try{var n=a.tty.cb.Ab(a.tty)}catch(t){throw new P(29);}if(void 0===n&&0===f)throw new P(6);if(null===n||void 0===n)break;f++;b[c+h]=n}f&&(a.node.timestamp=Date.now());return f},write:function(a,b,c,d){if(!a.tty||!a.tty.cb.qb)throw new P(60);
try{for(var f=0;f<d;f++)a.tty.cb.qb(a.tty,b[c+f])}catch(h){throw new P(29);}d&&(a.node.timestamp=Date.now());return f}},Kb={Ab:function(a){if(!a.input.length){var b=null;if(za){var c=Buffer.Cb?Buffer.Cb(256):new Buffer(256),d=0;try{d=Da.readSync(process.stdin.fd,c,0,256,null)}catch(f){if(-1!=f.toString().indexOf("EOF"))d=0;else throw f;}0<d?b=c.slice(0,d).toString("utf-8"):b=null}else"undefined"!=typeof window&&"function"==typeof window.prompt?(b=window.prompt("Input: "),null!==b&&(b+="\n")):"function"==
typeof readline&&(b=readline(),null!==b&&(b+="\n"));if(!b)return null;a.input=ka(b,!0)}return a.input.shift()},qb:function(a,b){null===b||10===b?(Ga(Va(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(Ga(Va(a.output,0)),a.output=[])}},Lb={qb:function(a,b){null===b||10===b?(I(Va(a.output,0)),a.output=[]):0!=b&&a.output.push(b)},flush:function(a){a.output&&0<a.output.length&&(I(Va(a.output,0)),a.output=[])}},Q={Va:null,Wa:function(){return Q.createNode(null,
"/",16895,0)},createNode:function(a,b,c,d){if(24576===(c&61440)||4096===(c&61440))throw new P(63);Q.Va||(Q.Va={dir:{node:{Ua:Q.Na.Ua,Ta:Q.Na.Ta,lookup:Q.Na.lookup,gb:Q.Na.gb,rename:Q.Na.rename,unlink:Q.Na.unlink,rmdir:Q.Na.rmdir,readdir:Q.Na.readdir,symlink:Q.Na.symlink},stream:{Za:Q.Oa.Za}},file:{node:{Ua:Q.Na.Ua,Ta:Q.Na.Ta},stream:{Za:Q.Oa.Za,read:Q.Oa.read,write:Q.Oa.write,sb:Q.Oa.sb,hb:Q.Oa.hb,ib:Q.Oa.ib}},link:{node:{Ua:Q.Na.Ua,Ta:Q.Na.Ta,readlink:Q.Na.readlink},stream:{}},wb:{node:{Ua:Q.Na.Ua,
Ta:Q.Na.Ta},stream:Mb}});c=Nb(a,b,c,d);R(c.mode)?(c.Na=Q.Va.dir.node,c.Oa=Q.Va.dir.stream,c.Ma={}):32768===(c.mode&61440)?(c.Na=Q.Va.file.node,c.Oa=Q.Va.file.stream,c.Sa=0,c.Ma=null):40960===(c.mode&61440)?(c.Na=Q.Va.link.node,c.Oa=Q.Va.link.stream):8192===(c.mode&61440)&&(c.Na=Q.Va.wb.node,c.Oa=Q.Va.wb.stream);c.timestamp=Date.now();a&&(a.Ma[b]=c);return c},Tb:function(a){if(a.Ma&&a.Ma.subarray){for(var b=[],c=0;c<a.Sa;++c)b.push(a.Ma[c]);return b}return a.Ma},Ub:function(a){return a.Ma?a.Ma.subarray?
a.Ma.subarray(0,a.Sa):new Uint8Array(a.Ma):new Uint8Array(0)},xb:function(a,b){var c=a.Ma?a.Ma.length:0;c>=b||(b=Math.max(b,c*(1048576>c?2:1.125)>>>0),0!=c&&(b=Math.max(b,256)),c=a.Ma,a.Ma=new Uint8Array(b),0<a.Sa&&a.Ma.set(c.subarray(0,a.Sa),0))},Qb:function(a,b){if(a.Sa!=b)if(0==b)a.Ma=null,a.Sa=0;else{if(!a.Ma||a.Ma.subarray){var c=a.Ma;a.Ma=new Uint8Array(b);c&&a.Ma.set(c.subarray(0,Math.min(b,a.Sa)))}else if(a.Ma||(a.Ma=[]),a.Ma.length>b)a.Ma.length=b;else for(;a.Ma.length<b;)a.Ma.push(0);a.Sa=
b}},Na:{Ua:function(a){var b={};b.dev=8192===(a.mode&61440)?a.id:1;b.ino=a.id;b.mode=a.mode;b.nlink=1;b.uid=0;b.gid=0;b.rdev=a.rdev;R(a.mode)?b.size=4096:32768===(a.mode&61440)?b.size=a.Sa:40960===(a.mode&61440)?b.size=a.link.length:b.size=0;b.atime=new Date(a.timestamp);b.mtime=new Date(a.timestamp);b.ctime=new Date(a.timestamp);b.Hb=4096;b.blocks=Math.ceil(b.size/b.Hb);return b},Ta:function(a,b){void 0!==b.mode&&(a.mode=b.mode);void 0!==b.timestamp&&(a.timestamp=b.timestamp);void 0!==b.size&&Q.Qb(a,
b.size)},lookup:function(){throw Ob[44];},gb:function(a,b,c,d){return Q.createNode(a,b,c,d)},rename:function(a,b,c){if(R(a.mode)){try{var d=Pb(b,c)}catch(h){}if(d)for(var f in d.Ma)throw new P(55);}delete a.parent.Ma[a.name];a.name=c;b.Ma[c]=a;a.parent=b},unlink:function(a,b){delete a.Ma[b]},rmdir:function(a,b){var c=Pb(a,b),d;for(d in c.Ma)throw new P(55);delete a.Ma[b]},readdir:function(a){var b=[".",".."],c;for(c in a.Ma)a.Ma.hasOwnProperty(c)&&b.push(c);return b},symlink:function(a,b,c){a=Q.createNode(a,
b,41471,0);a.link=c;return a},readlink:function(a){if(40960!==(a.mode&61440))throw new P(28);return a.link}},Oa:{read:function(a,b,c,d,f){var h=a.node.Ma;if(f>=a.node.Sa)return 0;a=Math.min(a.node.Sa-f,d);if(8<a&&h.subarray)b.set(h.subarray(f,f+a),c);else for(d=0;d<a;d++)b[c+d]=h[f+d];return a},write:function(a,b,c,d,f,h){b.buffer===A.buffer&&(h=!1);if(!d)return 0;a=a.node;a.timestamp=Date.now();if(b.subarray&&(!a.Ma||a.Ma.subarray)){if(h)return a.Ma=b.subarray(c,c+d),a.Sa=d;if(0===a.Sa&&0===f)return a.Ma=
b.slice(c,c+d),a.Sa=d;if(f+d<=a.Sa)return a.Ma.set(b.subarray(c,c+d),f),d}Q.xb(a,f+d);if(a.Ma.subarray&&b.subarray)a.Ma.set(b.subarray(c,c+d),f);else for(h=0;h<d;h++)a.Ma[f+h]=b[c+h];a.Sa=Math.max(a.Sa,f+d);return d},Za:function(a,b,c){1===c?b+=a.position:2===c&&32768===(a.node.mode&61440)&&(b+=a.node.Sa);if(0>b)throw new P(28);return b},sb:function(a,b,c){Q.xb(a.node,b+c);a.node.Sa=Math.max(a.node.Sa,b+c)},hb:function(a,b,c,d,f,h){assert(0===b);if(32768!==(a.node.mode&61440))throw new P(43);a=a.node.Ma;
if(h&2||a.buffer!==Xa){if(0<d||d+c<a.length)a.subarray?a=a.subarray(d,d+c):a=Array.prototype.slice.call(a,d,d+c);d=!0;h=16384*Math.ceil(c/16384);for(b=ca(h);c<h;)A[b+c++]=0;c=b;if(!c)throw new P(48);A.set(a,c)}else d=!1,c=a.byteOffset;return{Pb:c,kb:d}},ib:function(a,b,c,d,f){if(32768!==(a.node.mode&61440))throw new P(43);if(f&2)return 0;Q.Oa.write(a,b,0,d,c,!1);return 0}}},Qb=null,Rb={},S=[],Sb=1,T=null,Tb=!0,U={},P=null,Ob={};
function V(a,b){a=Fb("/",a);b=b||{};if(!a)return{path:"",node:null};var c={yb:!0,rb:0},d;for(d in c)void 0===b[d]&&(b[d]=c[d]);if(8<b.rb)throw new P(32);a=zb(a.split("/").filter(function(n){return!!n}),!1);var f=Qb;c="/";for(d=0;d<a.length;d++){var h=d===a.length-1;if(h&&b.parent)break;f=Pb(f,a[d]);c=r(c+"/"+a[d]);f.ab&&(!h||h&&b.yb)&&(f=f.ab.root);if(!h||b.Ya)for(h=0;40960===(f.mode&61440);)if(f=Ub(c),c=Fb(Ab(c),f),f=V(c,{rb:b.rb}).node,40<h++)throw new P(32);}return{path:c,node:f}}
function Vb(a){for(var b;;){if(a===a.parent)return a=a.Wa.Bb,b?"/"!==a[a.length-1]?a+"/"+b:a+b:a;b=b?a.name+"/"+b:a.name;a=a.parent}}function Wb(a,b){for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return(a+c>>>0)%T.length}function Xb(a){var b=Wb(a.parent.id,a.name);if(T[b]===a)T[b]=a.bb;else for(b=T[b];b;){if(b.bb===a){b.bb=a.bb;break}b=b.bb}}
function Pb(a,b){var c;if(c=(c=Yb(a,"x"))?c:a.Na.lookup?0:2)throw new P(c,a);for(c=T[Wb(a.id,b)];c;c=c.bb){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.Na.lookup(a,b)}function Nb(a,b,c,d){a=new Zb(a,b,c,d);b=Wb(a.parent.id,a.name);a.bb=T[b];return T[b]=a}function R(a){return 16384===(a&61440)}var $b={r:0,rs:1052672,"r+":2,w:577,wx:705,xw:705,"w+":578,"wx+":706,"xw+":706,a:1089,ax:1217,xa:1217,"a+":1090,"ax+":1218,"xa+":1218};
function ac(a){var b=["r","w","rw"][a&3];a&512&&(b+="w");return b}function Yb(a,b){if(Tb)return 0;if(-1===b.indexOf("r")||a.mode&292){if(-1!==b.indexOf("w")&&!(a.mode&146)||-1!==b.indexOf("x")&&!(a.mode&73))return 2}else return 2;return 0}function bc(a,b){try{return Pb(a,b),20}catch(c){}return Yb(a,"wx")}function cc(a,b,c){try{var d=Pb(a,b)}catch(f){return f.Qa}if(a=Yb(a,"wx"))return a;if(c){if(!R(d.mode))return 54;if(d===d.parent||"/"===Vb(d))return 10}else if(R(d.mode))return 31;return 0}
function dc(a){var b=4096;for(a=a||0;a<=b;a++)if(!S[a])return a;throw new P(33);}function ec(a,b){fc||(fc=function(){},fc.prototype={});var c=new fc,d;for(d in a)c[d]=a[d];a=c;b=dc(b);a.fd=b;return S[b]=a}var Mb={open:function(a){a.Oa=Rb[a.node.rdev].Oa;a.Oa.open&&a.Oa.open(a)},Za:function(){throw new P(70);}};function Ib(a,b){Rb[a]={Oa:b}}
function hc(a,b){var c="/"===b,d=!b;if(c&&Qb)throw new P(10);if(!c&&!d){var f=V(b,{yb:!1});b=f.path;f=f.node;if(f.ab)throw new P(10);if(!R(f.mode))throw new P(54);}b={type:a,Vb:{},Bb:b,Nb:[]};a=a.Wa(b);a.Wa=b;b.root=a;c?Qb=a:f&&(f.ab=b,f.Wa&&f.Wa.Nb.push(b))}function ea(a,b,c){var d=V(a,{parent:!0}).node;a=Bb(a);if(!a||"."===a||".."===a)throw new P(28);var f=bc(d,a);if(f)throw new P(f);if(!d.Na.gb)throw new P(63);return d.Na.gb(d,a,b,c)}function W(a,b){ea(a,(void 0!==b?b:511)&1023|16384,0)}
function ic(a,b,c){"undefined"===typeof c&&(c=b,b=438);ea(a,b|8192,c)}function jc(a,b){if(!Fb(a))throw new P(44);var c=V(b,{parent:!0}).node;if(!c)throw new P(44);b=Bb(b);var d=bc(c,b);if(d)throw new P(d);if(!c.Na.symlink)throw new P(63);c.Na.symlink(c,b,a)}
function sa(a){var b=V(a,{parent:!0}).node,c=Bb(a),d=Pb(b,c),f=cc(b,c,!1);if(f)throw new P(f);if(!b.Na.unlink)throw new P(63);if(d.ab)throw new P(10);try{U.willDeletePath&&U.willDeletePath(a)}catch(h){I("FS.trackingDelegate['willDeletePath']('"+a+"') threw an exception: "+h.message)}b.Na.unlink(b,c);Xb(d);try{if(U.onDeletePath)U.onDeletePath(a)}catch(h){I("FS.trackingDelegate['onDeletePath']('"+a+"') threw an exception: "+h.message)}}
function Ub(a){a=V(a).node;if(!a)throw new P(44);if(!a.Na.readlink)throw new P(28);return Fb(Vb(a.parent),a.Na.readlink(a))}function kc(a,b){a=V(a,{Ya:!b}).node;if(!a)throw new P(44);if(!a.Na.Ua)throw new P(63);return a.Na.Ua(a)}function lc(a){return kc(a,!0)}function fa(a,b){var c;"string"===typeof a?c=V(a,{Ya:!0}).node:c=a;if(!c.Na.Ta)throw new P(63);c.Na.Ta(c,{mode:b&4095|c.mode&-4096,timestamp:Date.now()})}
function mc(a){var b;"string"===typeof a?b=V(a,{Ya:!0}).node:b=a;if(!b.Na.Ta)throw new P(63);b.Na.Ta(b,{timestamp:Date.now()})}function nc(a,b){if(0>b)throw new P(28);var c;"string"===typeof a?c=V(a,{Ya:!0}).node:c=a;if(!c.Na.Ta)throw new P(63);if(R(c.mode))throw new P(31);if(32768!==(c.mode&61440))throw new P(28);if(a=Yb(c,"w"))throw new P(a);c.Na.Ta(c,{size:b,timestamp:Date.now()})}
function u(a,b,c,d){if(""===a)throw new P(44);if("string"===typeof b){var f=$b[b];if("undefined"===typeof f)throw Error("Unknown file open mode: "+b);b=f}c=b&64?("undefined"===typeof c?438:c)&4095|32768:0;if("object"===typeof a)var h=a;else{a=r(a);try{h=V(a,{Ya:!(b&131072)}).node}catch(n){}}f=!1;if(b&64)if(h){if(b&128)throw new P(20);}else h=ea(a,c,0),f=!0;if(!h)throw new P(44);8192===(h.mode&61440)&&(b&=-513);if(b&65536&&!R(h.mode))throw new P(54);if(!f&&(c=h?40960===(h.mode&61440)?32:R(h.mode)&&
("r"!==ac(b)||b&512)?31:Yb(h,ac(b)):44))throw new P(c);b&512&&nc(h,0);b&=-131713;d=ec({node:h,path:Vb(h),flags:b,seekable:!0,position:0,Oa:h.Oa,Sb:[],error:!1},d);d.Oa.open&&d.Oa.open(d);!e.logReadFiles||b&1||(Pc||(Pc={}),a in Pc||(Pc[a]=1,I("FS.trackingDelegate error on read file: "+a)));try{U.onOpenFile&&(h=0,1!==(b&2097155)&&(h|=1),0!==(b&2097155)&&(h|=2),U.onOpenFile(a,h))}catch(n){I("FS.trackingDelegate['onOpenFile']('"+a+"', flags) threw an exception: "+n.message)}return d}
function ia(a){if(null===a.fd)throw new P(8);a.ob&&(a.ob=null);try{a.Oa.close&&a.Oa.close(a)}catch(b){throw b;}finally{S[a.fd]=null}a.fd=null}function Qc(a,b,c){if(null===a.fd)throw new P(8);if(!a.seekable||!a.Oa.Za)throw new P(70);if(0!=c&&1!=c&&2!=c)throw new P(28);a.position=a.Oa.Za(a,b,c);a.Sb=[]}
function Sc(a,b,c,d,f){if(0>d||0>f)throw new P(28);if(null===a.fd)throw new P(8);if(1===(a.flags&2097155))throw new P(8);if(R(a.node.mode))throw new P(31);if(!a.Oa.read)throw new P(28);var h="undefined"!==typeof f;if(!h)f=a.position;else if(!a.seekable)throw new P(70);b=a.Oa.read(a,b,c,d,f);h||(a.position+=b);return b}
function ha(a,b,c,d,f,h){if(0>d||0>f)throw new P(28);if(null===a.fd)throw new P(8);if(0===(a.flags&2097155))throw new P(8);if(R(a.node.mode))throw new P(31);if(!a.Oa.write)throw new P(28);a.seekable&&a.flags&1024&&Qc(a,0,2);var n="undefined"!==typeof f;if(!n)f=a.position;else if(!a.seekable)throw new P(70);b=a.Oa.write(a,b,c,d,f,h);n||(a.position+=b);try{if(a.path&&U.onWriteToFile)U.onWriteToFile(a.path)}catch(t){I("FS.trackingDelegate['onWriteToFile']('"+a.path+"') threw an exception: "+t.message)}return b}
function ra(a){var b={encoding:"binary"};b=b||{};b.flags=b.flags||"r";b.encoding=b.encoding||"binary";if("utf8"!==b.encoding&&"binary"!==b.encoding)throw Error('Invalid encoding type "'+b.encoding+'"');var c,d=u(a,b.flags);a=kc(a).size;var f=new Uint8Array(a);Sc(d,f,0,a,0);"utf8"===b.encoding?c=Va(f,0):"binary"===b.encoding&&(c=f);ia(d);return c}
function Tc(){P||(P=function(a,b){this.node=b;this.Rb=function(c){this.Qa=c};this.Rb(a);this.message="FS error"},P.prototype=Error(),P.prototype.constructor=P,[44].forEach(function(a){Ob[a]=new P(a);Ob[a].stack="<generic error, no stack>"}))}var Uc;function da(a,b){var c=0;a&&(c|=365);b&&(c|=146);return c}
function Vc(a,b,c){a=r("/dev/"+a);var d=da(!!b,!!c);Wc||(Wc=64);var f=Wc++<<8|0;Ib(f,{open:function(h){h.seekable=!1},close:function(){c&&c.buffer&&c.buffer.length&&c(10)},read:function(h,n,t,w){for(var v=0,C=0;C<w;C++){try{var H=b()}catch(Z){throw new P(29);}if(void 0===H&&0===v)throw new P(6);if(null===H||void 0===H)break;v++;n[t+C]=H}v&&(h.node.timestamp=Date.now());return v},write:function(h,n,t,w){for(var v=0;v<w;v++)try{c(n[t+v])}catch(C){throw new P(29);}w&&(h.node.timestamp=Date.now());return v}});
ic(a,d,f)}var Wc,X={},fc,Pc,Xc={};
function Yc(a,b,c){try{var d=a(b)}catch(f){if(f&&f.node&&r(b)!==r(Vb(f.node)))return-54;throw f;}K[c>>2]=d.dev;K[c+4>>2]=0;K[c+8>>2]=d.ino;K[c+12>>2]=d.mode;K[c+16>>2]=d.nlink;K[c+20>>2]=d.uid;K[c+24>>2]=d.gid;K[c+28>>2]=d.rdev;K[c+32>>2]=0;L=[d.size>>>0,(O=d.size,1<=+Math.abs(O)?0<O?(Math.min(+Math.floor(O/4294967296),4294967295)|0)>>>0:~~+Math.ceil((O-+(~~O>>>0))/4294967296)>>>0:0)];K[c+40>>2]=L[0];K[c+44>>2]=L[1];K[c+48>>2]=4096;K[c+52>>2]=d.blocks;K[c+56>>2]=d.atime.getTime()/1E3|0;K[c+60>>2]=
0;K[c+64>>2]=d.mtime.getTime()/1E3|0;K[c+68>>2]=0;K[c+72>>2]=d.ctime.getTime()/1E3|0;K[c+76>>2]=0;L=[d.ino>>>0,(O=d.ino,1<=+Math.abs(O)?0<O?(Math.min(+Math.floor(O/4294967296),4294967295)|0)>>>0:~~+Math.ceil((O-+(~~O>>>0))/4294967296)>>>0:0)];K[c+80>>2]=L[0];K[c+84>>2]=L[1];return 0}var Zc=void 0;function $c(){Zc+=4;return K[Zc-4>>2]}function Y(a){a=S[a];if(!a)throw new P(8);return a}var ad={};
function bd(){if(!cd){var a={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"===typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:wa||"./this.program"},b;for(b in ad)a[b]=ad[b];var c=[];for(b in a)c.push(b+"="+a[b]);cd=c}return cd}var cd,dd;za?dd=function(){var a=process.hrtime();return 1E3*a[0]+a[1]/1E6}:"undefined"!==typeof dateNow?dd=dateNow:dd=function(){return performance.now()};
function ed(a){for(var b=dd();dd()-b<a/1E3;);}e._usleep=ed;function Zb(a,b,c,d){a||(a=this);this.parent=a;this.Wa=a.Wa;this.ab=null;this.id=Sb++;this.name=b;this.mode=c;this.Na={};this.Oa={};this.rdev=d}Object.defineProperties(Zb.prototype,{read:{get:function(){return 365===(this.mode&365)},set:function(a){a?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146===(this.mode&146)},set:function(a){a?this.mode|=146:this.mode&=-147}}});Tc();T=Array(4096);hc(Q,"/");W("/tmp");W("/home");W("/home/web_user");
(function(){W("/dev");Ib(259,{read:function(){return 0},write:function(b,c,d,f){return f}});ic("/dev/null",259);Hb(1280,Kb);Hb(1536,Lb);ic("/dev/tty",1280);ic("/dev/tty1",1536);var a=Eb();Vc("random",a);Vc("urandom",a);W("/dev/shm");W("/dev/shm/tmp")})();W("/proc");W("/proc/self");W("/proc/self/fd");
hc({Wa:function(){var a=Nb("/proc/self","fd",16895,73);a.Na={lookup:function(b,c){var d=S[+c];if(!d)throw new P(8);b={parent:null,Wa:{Bb:"fake"},Na:{readlink:function(){return d.path}}};return b.parent=b}};return a}},"/proc/self/fd");function ka(a,b){var c=Array(ba(a)+1);a=k(a,c,0,c.length);b&&(c.length=a);return c}ab.push({Ib:function(){fd()}});
var id={b:function(a,b,c,d){J("Assertion failed: "+B(a)+", at: "+[b?B(b):"unknown filename",c,d?B(d):"unknown function"])},q:function(a,b){tb();a=new Date(1E3*K[a>>2]);K[b>>2]=a.getSeconds();K[b+4>>2]=a.getMinutes();K[b+8>>2]=a.getHours();K[b+12>>2]=a.getDate();K[b+16>>2]=a.getMonth();K[b+20>>2]=a.getFullYear()-1900;K[b+24>>2]=a.getDay();var c=new Date(a.getFullYear(),0,1);K[b+28>>2]=(a.getTime()-c.getTime())/864E5|0;K[b+36>>2]=-(60*a.getTimezoneOffset());var d=(new Date(a.getFullYear(),6,1)).getTimezoneOffset();
c=c.getTimezoneOffset();a=(d!=c&&a.getTimezoneOffset()==Math.min(c,d))|0;K[b+32>>2]=a;a=K[yb()+(a?4:0)>>2];K[b+40>>2]=a;return b},J:function(a,b){try{a=B(a);if(b&-8)var c=-28;else{var d;(d=V(a,{Ya:!0}).node)?(a="",b&4&&(a+="r"),b&2&&(a+="w"),b&1&&(a+="x"),c=a&&Yb(d,a)?-2:0):c=-44}return c}catch(f){return"undefined"!==typeof X&&f instanceof P||J(f),-f.Qa}},u:function(a,b){try{return a=B(a),fa(a,b),0}catch(c){return"undefined"!==typeof X&&c instanceof P||J(c),-c.Qa}},F:function(a){try{return a=B(a),
mc(a),0}catch(b){return"undefined"!==typeof X&&b instanceof P||J(b),-b.Qa}},v:function(a,b){try{var c=S[a];if(!c)throw new P(8);fa(c.node,b);return 0}catch(d){return"undefined"!==typeof X&&d instanceof P||J(d),-d.Qa}},G:function(a){try{var b=S[a];if(!b)throw new P(8);mc(b.node);return 0}catch(c){return"undefined"!==typeof X&&c instanceof P||J(c),-c.Qa}},c:function(a,b,c){Zc=c;try{var d=Y(a);switch(b){case 0:var f=$c();return 0>f?-28:u(d.path,d.flags,0,f).fd;case 1:case 2:return 0;case 3:return d.flags;
case 4:return f=$c(),d.flags|=f,0;case 12:return f=$c(),La[f+0>>1]=2,0;case 13:case 14:return 0;case 16:case 8:return-28;case 9:return Cb(28),-1;default:return-28}}catch(h){return"undefined"!==typeof X&&h instanceof P||J(h),-h.Qa}},w:function(a,b){try{var c=Y(a);return Yc(kc,c.path,b)}catch(d){return"undefined"!==typeof X&&d instanceof P||J(d),-d.Qa}},K:function(a,b,c){try{var d=S[a];if(!d)throw new P(8);if(0===(d.flags&2097155))throw new P(28);nc(d.node,c);return 0}catch(f){return"undefined"!==typeof X&&
f instanceof P||J(f),-f.Qa}},x:function(a,b){try{if(0===b)return-28;if(b<ba("/")+1)return-68;k("/",m,a,b);return a}catch(c){return"undefined"!==typeof X&&c instanceof P||J(c),-c.Qa}},H:function(){return 0},e:function(){return 42},t:function(a,b){try{return a=B(a),Yc(lc,a,b)}catch(c){return"undefined"!==typeof X&&c instanceof P||J(c),-c.Qa}},s:function(a,b){try{return a=B(a),a=r(a),"/"===a[a.length-1]&&(a=a.substr(0,a.length-1)),W(a,b),0}catch(c){return"undefined"!==typeof X&&c instanceof P||J(c),
-c.Qa}},j:function(a,b,c,d,f,h){try{a:{h<<=12;var n=!1;if(0!==(d&16)&&0!==a%16384)var t=-28;else{if(0!==(d&32)){var w=gd(16384,b);if(!w){t=-48;break a}hd(w,0,b);n=!0}else{var v=S[f];if(!v){t=-8;break a}var C=h;if(0!==(c&2)&&0===(d&2)&&2!==(v.flags&2097155))throw new P(2);if(1===(v.flags&2097155))throw new P(2);if(!v.Oa.hb)throw new P(43);var H=v.Oa.hb(v,a,b,C,c,d);w=H.Pb;n=H.kb}Xc[w]={Mb:w,Lb:b,kb:n,fd:f,Ob:c,flags:d,offset:h};t=w}}return t}catch(Z){return"undefined"!==typeof X&&Z instanceof P||J(Z),
-Z.Qa}},k:function(a,b){try{if(-1===(a|0)||0===b)var c=-28;else{var d=Xc[a];if(d&&b===d.Lb){var f=S[d.fd];if(d.Ob&2){var h=d.flags,n=d.offset,t=m.slice(a,a+b);f&&f.Oa.ib&&f.Oa.ib(f,t,n,b,h)}Xc[a]=null;d.kb&&ma(d.Mb)}c=0}return c}catch(w){return"undefined"!==typeof X&&w instanceof P||J(w),-w.Qa}},i:function(a,b,c){Zc=c;try{var d=B(a),f=$c();return u(d,b,f).fd}catch(h){return"undefined"!==typeof X&&h instanceof P||J(h),-h.Qa}},A:function(a,b,c){try{var d=Y(a);return Sc(d,A,b,c)}catch(f){return"undefined"!==
typeof X&&f instanceof P||J(f),-f.Qa}},E:function(a,b,c){try{a=B(a);if(0>=c)var d=-28;else{var f=Ub(a),h=Math.min(c,ba(f)),n=A[b+h];k(f,m,b,c+1);A[b+h]=n;d=h}return d}catch(t){return"undefined"!==typeof X&&t instanceof P||J(t),-t.Qa}},C:function(a){try{a=B(a);var b=V(a,{parent:!0}).node,c=Bb(a),d=Pb(b,c),f=cc(b,c,!0);if(f)throw new P(f);if(!b.Na.rmdir)throw new P(63);if(d.ab)throw new P(10);try{U.willDeletePath&&U.willDeletePath(a)}catch(h){I("FS.trackingDelegate['willDeletePath']('"+a+"') threw an exception: "+
h.message)}b.Na.rmdir(b,c);Xb(d);try{if(U.onDeletePath)U.onDeletePath(a)}catch(h){I("FS.trackingDelegate['onDeletePath']('"+a+"') threw an exception: "+h.message)}return 0}catch(h){return"undefined"!==typeof X&&h instanceof P||J(h),-h.Qa}},g:function(a,b){try{return a=B(a),Yc(kc,a,b)}catch(c){return"undefined"!==typeof X&&c instanceof P||J(c),-c.Qa}},y:function(a){try{return a=B(a),sa(a),0}catch(b){return"undefined"!==typeof X&&b instanceof P||J(b),-b.Qa}},m:function(a,b,c){m.copyWithin(a,b,b+c)},
d:function(a){a>>>=0;var b=m.length;if(2147483648<a)return!1;for(var c=1;4>=c;c*=2){var d=b*(1+.2/c);d=Math.min(d,a+100663296);d=Math.max(16777216,a,d);0<d%65536&&(d+=65536-d%65536);a:{try{Oa.grow(Math.min(2147483648,d)-Xa.byteLength+65535>>>16);Ya(Oa.buffer);var f=1;break a}catch(h){}f=void 0}if(f)return!0}return!1},o:function(a,b){var c=0;bd().forEach(function(d,f){var h=b+c;f=K[a+4*f>>2]=h;for(h=0;h<d.length;++h)A[f++>>0]=d.charCodeAt(h);A[f>>0]=0;c+=d.length+1});return 0},p:function(a,b){var c=
bd();K[a>>2]=c.length;var d=0;c.forEach(function(f){d+=f.length+1});K[b>>2]=d;return 0},f:function(a){try{var b=Y(a);ia(b);return 0}catch(c){return"undefined"!==typeof X&&c instanceof P||J(c),c.Qa}},n:function(a,b){try{var c=Y(a);A[b>>0]=c.tty?2:R(c.mode)?3:40960===(c.mode&61440)?7:4;return 0}catch(d){return"undefined"!==typeof X&&d instanceof P||J(d),d.Qa}},l:function(a,b,c,d,f){try{var h=Y(a);a=4294967296*c+(b>>>0);if(-9007199254740992>=a||9007199254740992<=a)return-61;Qc(h,a,d);L=[h.position>>>
0,(O=h.position,1<=+Math.abs(O)?0<O?(Math.min(+Math.floor(O/4294967296),4294967295)|0)>>>0:~~+Math.ceil((O-+(~~O>>>0))/4294967296)>>>0:0)];K[f>>2]=L[0];K[f+4>>2]=L[1];h.ob&&0===a&&0===d&&(h.ob=null);return 0}catch(n){return"undefined"!==typeof X&&n instanceof P||J(n),n.Qa}},I:function(a){try{var b=Y(a);return b.Oa&&b.Oa.fsync?-b.Oa.fsync(b):0}catch(c){return"undefined"!==typeof X&&c instanceof P||J(c),c.Qa}},D:function(a,b,c,d){try{a:{for(var f=Y(a),h=a=0;h<c;h++){var n=ha(f,A,K[b+8*h>>2],K[b+(8*
h+4)>>2],void 0);if(0>n){var t=-1;break a}a+=n}t=a}K[d>>2]=t;return 0}catch(w){return"undefined"!==typeof X&&w instanceof P||J(w),w.Qa}},h:function(a){var b=Date.now();K[a>>2]=b/1E3|0;K[a+4>>2]=b%1E3*1E3|0;return 0},a:Oa,z:function(a,b){if(0===a)return Cb(28),-1;var c=K[a>>2];a=K[a+4>>2];if(0>a||999999999<a||0>c)return Cb(28),-1;0!==b&&(K[b>>2]=0,K[b+4>>2]=0);return ed(1E6*c+a/1E3)},B:function(a){switch(a){case 30:return 16384;case 85:return 131072;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:case 79:return 200809;
case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;
case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1E3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:return"object"===typeof navigator?navigator.hardwareConcurrency||1:1}Cb(28);return-1},
L:function(a){var b=Date.now()/1E3|0;a&&(K[a>>2]=b);return b},r:function(a,b){if(b){var c=1E3*K[b+8>>2];c+=K[b+12>>2]/1E3}else c=Date.now();a=B(a);try{b=c;var d=V(a,{Ya:!0}).node;d.Na.Ta(d,{timestamp:Math.max(b,c)});return 0}catch(f){a=f;if(!(a instanceof P)){a+=" : ";a:{d=Error();if(!d.stack){try{throw Error();}catch(h){d=h}if(!d.stack){d="(no stack trace available)";break a}}d=d.stack.toString()}e.extraStackTrace&&(d+="\n"+e.extraStackTrace());d=ob(d);throw a+d;}Cb(a.Qa);return-1}}};
(function(){function a(f){e.asm=f.exports;Ja=e.asm.M;eb--;e.monitorRunDependencies&&e.monitorRunDependencies(eb);0==eb&&(null!==fb&&(clearInterval(fb),fb=null),gb&&(f=gb,gb=null,f()))}function b(f){a(f.instance)}function c(f){return mb().then(function(h){return WebAssembly.instantiate(h,d)}).then(f,function(h){I("failed to asynchronously prepare wasm: "+h);J(h)})}var d={a:id};eb++;e.monitorRunDependencies&&e.monitorRunDependencies(eb);if(e.instantiateWasm)try{return e.instantiateWasm(d,a)}catch(f){return I("Module.instantiateWasm callback failed with error: "+
f),!1}(function(){if(Ka||"function"!==typeof WebAssembly.instantiateStreaming||jb()||hb("file://")||"function"!==typeof fetch)return c(b);fetch(ib,{credentials:"same-origin"}).then(function(f){return WebAssembly.instantiateStreaming(f,d).then(b,function(h){I("wasm streaming compile failed: "+h);I("falling back to ArrayBuffer instantiation");return c(b)})})})();return{}})();
var fd=e.___wasm_call_ctors=function(){return(fd=e.___wasm_call_ctors=e.asm.N).apply(null,arguments)},hd=e._memset=function(){return(hd=e._memset=e.asm.O).apply(null,arguments)};e._sqlite3_free=function(){return(e._sqlite3_free=e.asm.P).apply(null,arguments)};var Db=e.___errno_location=function(){return(Db=e.___errno_location=e.asm.Q).apply(null,arguments)};e._sqlite3_finalize=function(){return(e._sqlite3_finalize=e.asm.R).apply(null,arguments)};
e._sqlite3_reset=function(){return(e._sqlite3_reset=e.asm.S).apply(null,arguments)};e._sqlite3_clear_bindings=function(){return(e._sqlite3_clear_bindings=e.asm.T).apply(null,arguments)};e._sqlite3_value_blob=function(){return(e._sqlite3_value_blob=e.asm.U).apply(null,arguments)};e._sqlite3_value_text=function(){return(e._sqlite3_value_text=e.asm.V).apply(null,arguments)};e._sqlite3_value_bytes=function(){return(e._sqlite3_value_bytes=e.asm.W).apply(null,arguments)};
e._sqlite3_value_double=function(){return(e._sqlite3_value_double=e.asm.X).apply(null,arguments)};e._sqlite3_value_int=function(){return(e._sqlite3_value_int=e.asm.Y).apply(null,arguments)};e._sqlite3_value_type=function(){return(e._sqlite3_value_type=e.asm.Z).apply(null,arguments)};e._sqlite3_result_blob=function(){return(e._sqlite3_result_blob=e.asm._).apply(null,arguments)};e._sqlite3_result_double=function(){return(e._sqlite3_result_double=e.asm.$).apply(null,arguments)};
e._sqlite3_result_error=function(){return(e._sqlite3_result_error=e.asm.aa).apply(null,arguments)};e._sqlite3_result_int=function(){return(e._sqlite3_result_int=e.asm.ba).apply(null,arguments)};e._sqlite3_result_int64=function(){return(e._sqlite3_result_int64=e.asm.ca).apply(null,arguments)};e._sqlite3_result_null=function(){return(e._sqlite3_result_null=e.asm.da).apply(null,arguments)};e._sqlite3_result_text=function(){return(e._sqlite3_result_text=e.asm.ea).apply(null,arguments)};
e._sqlite3_step=function(){return(e._sqlite3_step=e.asm.fa).apply(null,arguments)};e._sqlite3_column_count=function(){return(e._sqlite3_column_count=e.asm.ga).apply(null,arguments)};e._sqlite3_data_count=function(){return(e._sqlite3_data_count=e.asm.ha).apply(null,arguments)};e._sqlite3_column_blob=function(){return(e._sqlite3_column_blob=e.asm.ia).apply(null,arguments)};e._sqlite3_column_bytes=function(){return(e._sqlite3_column_bytes=e.asm.ja).apply(null,arguments)};
e._sqlite3_column_double=function(){return(e._sqlite3_column_double=e.asm.ka).apply(null,arguments)};e._sqlite3_column_text=function(){return(e._sqlite3_column_text=e.asm.la).apply(null,arguments)};e._sqlite3_column_type=function(){return(e._sqlite3_column_type=e.asm.ma).apply(null,arguments)};e._sqlite3_column_name=function(){return(e._sqlite3_column_name=e.asm.na).apply(null,arguments)};e._sqlite3_bind_blob=function(){return(e._sqlite3_bind_blob=e.asm.oa).apply(null,arguments)};
e._sqlite3_bind_double=function(){return(e._sqlite3_bind_double=e.asm.pa).apply(null,arguments)};e._sqlite3_bind_int=function(){return(e._sqlite3_bind_int=e.asm.qa).apply(null,arguments)};e._sqlite3_bind_text=function(){return(e._sqlite3_bind_text=e.asm.ra).apply(null,arguments)};e._sqlite3_bind_parameter_index=function(){return(e._sqlite3_bind_parameter_index=e.asm.sa).apply(null,arguments)};e._sqlite3_sql=function(){return(e._sqlite3_sql=e.asm.ta).apply(null,arguments)};
e._sqlite3_normalized_sql=function(){return(e._sqlite3_normalized_sql=e.asm.ua).apply(null,arguments)};e._sqlite3_errmsg=function(){return(e._sqlite3_errmsg=e.asm.va).apply(null,arguments)};e._sqlite3_exec=function(){return(e._sqlite3_exec=e.asm.wa).apply(null,arguments)};e._sqlite3_prepare_v2=function(){return(e._sqlite3_prepare_v2=e.asm.xa).apply(null,arguments)};e._sqlite3_changes=function(){return(e._sqlite3_changes=e.asm.ya).apply(null,arguments)};
e._sqlite3_close_v2=function(){return(e._sqlite3_close_v2=e.asm.za).apply(null,arguments)};e._sqlite3_create_function_v2=function(){return(e._sqlite3_create_function_v2=e.asm.Aa).apply(null,arguments)};e._sqlite3_open=function(){return(e._sqlite3_open=e.asm.Ba).apply(null,arguments)};var ca=e._malloc=function(){return(ca=e._malloc=e.asm.Ca).apply(null,arguments)},ma=e._free=function(){return(ma=e._free=e.asm.Da).apply(null,arguments)};
e._RegisterExtensionFunctions=function(){return(e._RegisterExtensionFunctions=e.asm.Ea).apply(null,arguments)};
var yb=e.__get_tzname=function(){return(yb=e.__get_tzname=e.asm.Fa).apply(null,arguments)},wb=e.__get_daylight=function(){return(wb=e.__get_daylight=e.asm.Ga).apply(null,arguments)},vb=e.__get_timezone=function(){return(vb=e.__get_timezone=e.asm.Ha).apply(null,arguments)},na=e.stackSave=function(){return(na=e.stackSave=e.asm.Ia).apply(null,arguments)},pa=e.stackRestore=function(){return(pa=e.stackRestore=e.asm.Ja).apply(null,arguments)},y=e.stackAlloc=function(){return(y=e.stackAlloc=e.asm.Ka).apply(null,
arguments)},gd=e._memalign=function(){return(gd=e._memalign=e.asm.La).apply(null,arguments)};e.cwrap=function(a,b,c,d){c=c||[];var f=c.every(function(h){return"number"===h});return"string"!==b&&f&&!d?Qa(a):function(){return Ra(a,b,c,arguments)}};e.UTF8ToString=B;e.stackSave=na;e.stackRestore=pa;e.stackAlloc=y;var jd;gb=function kd(){jd||ld();jd||(gb=kd)};
function ld(){function a(){if(!jd&&(jd=!0,e.calledRun=!0,!Pa)){e.noFSInit||Uc||(Uc=!0,Tc(),e.stdin=e.stdin,e.stdout=e.stdout,e.stderr=e.stderr,e.stdin?Vc("stdin",e.stdin):jc("/dev/tty","/dev/stdin"),e.stdout?Vc("stdout",null,e.stdout):jc("/dev/tty","/dev/stdout"),e.stderr?Vc("stderr",null,e.stderr):jc("/dev/tty1","/dev/stderr"),u("/dev/stdin","r"),u("/dev/stdout","w"),u("/dev/stderr","w"));nb(ab);Tb=!1;nb(bb);if(e.onRuntimeInitialized)e.onRuntimeInitialized();if(e.postRun)for("function"==typeof e.postRun&&
(e.postRun=[e.postRun]);e.postRun.length;){var b=e.postRun.shift();cb.unshift(b)}nb(cb)}}if(!(0<eb)){if(e.preRun)for("function"==typeof e.preRun&&(e.preRun=[e.preRun]);e.preRun.length;)db();nb($a);0<eb||(e.setStatus?(e.setStatus("Running..."),setTimeout(function(){setTimeout(function(){e.setStatus("")},1);a()},1)):a())}}e.run=ld;if(e.preInit)for("function"==typeof e.preInit&&(e.preInit=[e.preInit]);0<e.preInit.length;)e.preInit.pop()();noExitRuntime=!0;ld();


        // The shell-pre.js and emcc-generated code goes above
        return Module;
    }); // The end of the promise being returned

  return initSqlJsPromise;
} // The end of our initSqlJs function

// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
// However, we don't want to use the emcc modularization. See shell-pre.js
if (typeof exports === 'object' && typeof module === 'object'){
    module.exports = initSqlJs;
    // This will allow the module to be used in ES6 or CommonJS
    module.exports.default = initSqlJs;
}
else if (typeof define === 'function' && define['amd']) {
    define([], function() { return initSqlJs; });
}
else if (typeof exports === 'object'){
    exports["Module"] = initSqlJs;
}
/* global initSqlJs */
/* eslint-env worker */
/* eslint no-restricted-globals: ["error"] */

"use strict";

var db;

function onModuleReady(SQL) {
    function createDb(data) {
        if (db != null) db.close();
        db = new SQL.Database(data);
        return db;
    }

    var buff; var data; var result;
    data = this["data"];
    var config = data["config"] ? data["config"] : {};
    switch (data && data["action"]) {
        case "open":
            buff = data["buffer"];
            createDb(buff && new Uint8Array(buff));
            return postMessage({
                id: data["id"],
                ready: true
            });
        case "exec":
            if (db === null) {
                createDb();
            }
            if (!data["sql"]) {
                throw "exec: Missing query string";
            }
            return postMessage({
                id: data["id"],
                results: db.exec(data["sql"], data["params"], config)
            });
        case "each":
            if (db === null) {
                createDb();
            }
            var callback = function callback(row) {
                return postMessage({
                    id: data["id"],
                    row: row,
                    finished: false
                });
            };
            var done = function done() {
                return postMessage({
                    id: data["id"],
                    finished: true
                });
            };
            return db.each(data["sql"], data["params"], callback, done, config);
        case "export":
            buff = db["export"]();
            result = {
                id: data["id"],
                buffer: buff
            };
            try {
                return postMessage(result, [result]);
            } catch (error) {
                return postMessage(result);
            }
        case "close":
            if (db) {
                db.close();
            }
            return postMessage({
                id: data["id"]
            });
        default:
            throw new Error("Invalid action : " + (data && data["action"]));
    }
}

function onError(err) {
    return postMessage({
        id: this["data"]["id"],
        error: err["message"]
    });
}

if (typeof importScripts === "function") {
    db = null;
    var sqlModuleReady = initSqlJs();
    self.onmessage = function onmessage(event) {
        return sqlModuleReady
            .then(onModuleReady.bind(event))
            .catch(onError.bind(event));
    };
}
