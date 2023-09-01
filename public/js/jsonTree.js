var jsonTree=function(){var e,t={getClass:function(e){return Object.prototype.toString.call(e)},getType:function(e){if(null===e)return"null";switch(typeof e){case"number":return"number";case"string":return"string";case"boolean":return"boolean"}switch(t.getClass(e)){case"[object Array]":return"array";case"[object Object]":return"object"}throw new Error("Bad type: "+t.getClass(e))},forEachNode:function(e,n){var s;switch(t.getType(e)){case"array":s=e.length-1,e.forEach((function(e,t){n(t,e,t===s)}));break;case"object":var o=Object.keys(e).sort();s=o.length-1,o.forEach((function(t,o){n(t,e[t],o===s)}))}},inherits:(e=function(){},function(t,n){e.prototype=n.prototype,t.prototype=new e,t.prototype.constructor=t}),isValidRoot:function(e){switch(t.getType(e)){case"object":case"array":return!0;default:return!1}},extend:function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])}};function n(e,s,o){var r=t.getType(s);if(r in n.CONSTRUCTORS)return new n.CONSTRUCTORS[r](e,s,o);throw new Error("Bad type: "+t.getClass(s))}function s(e,t,n){if(this.constructor===s)throw new Error("This is abstract class");var o=this,r=document.createElement("li");o.label=e,o.isComplex=!1,r.classList.add("jsontree_node"),r.innerHTML=function(e,t){return'                  <span class="jsontree_label-wrapper">                      <span class="jsontree_label">"'+e+'"</span> :                   </span>                  <span class="jsontree_value-wrapper">                      <span class="jsontree_value jsontree_value_'+o.type+'">'+t+"</span>"+(n?"":",")+"</span>"}(e,t),o.el=r,r.querySelector(".jsontree_label").addEventListener("click",(function(e){if(!e.altKey)return e.shiftKey?(document.getSelection().removeAllRanges(),void alert(o.getJSONPath())):void 0;o.toggleMarked()}),!1)}function o(e,t,n){this.type="boolean",s.call(this,e,t,n)}function r(e,t,n){this.type="number",s.call(this,e,t,n)}function i(e,t,n){this.type="string",s.call(this,e,'"'+t+'"',n)}function a(e,t,n){this.type="null",s.call(this,e,t,n)}function l(e,s,o){if(this.constructor===l)throw new Error("This is abstract class");var r,i,a,c=this,d=document.createElement("li"),h=[];c.label=e,c.isComplex=!0,d.classList.add("jsontree_node"),d.classList.add("jsontree_node_complex"),d.innerHTML=function(e,t){var n=o?"":",",s='                      <div class="jsontree_value-wrapper">                          <div class="jsontree_value jsontree_value_'+c.type+'">                              <b>'+t[0]+'</b>                              <span class="jsontree_show-more">&hellip;</span>                              <ul class="jsontree_child-nodes"></ul>                              <b>'+t[1]+"</b></div>"+n+"</div>";return null!==e&&(s='                      <span class="jsontree_label-wrapper">                          <span class="jsontree_label"><span class="jsontree_expand-button"></span>"'+e+'"</span> :                       </span>'+s),s}(e,c.sym),r=d.querySelector(".jsontree_child-nodes"),null!==e?(i=d.querySelector(".jsontree_label"),a=d.querySelector(".jsontree_show-more"),i.addEventListener("click",(function(e){if(!e.altKey)return e.shiftKey?(document.getSelection().removeAllRanges(),void alert(c.getJSONPath())):void c.toggle(e.ctrlKey||e.metaKey);c.toggleMarked()}),!1),a.addEventListener("click",(function(e){c.toggle(e.ctrlKey||e.metaKey)}),!1),c.isRoot=!1):(c.isRoot=!0,c.parent=null,d.classList.add("jsontree_node_expanded")),c.el=d,c.childNodes=h,c.childNodesUl=r,t.forEachNode(s,(function(e,t,s){c.addChild(new n(e,t,s))})),c.isEmpty=!Boolean(h.length),c.isEmpty&&d.classList.add("jsontree_node_empty")}function c(e,t,n){this.sym=["{","}"],this.type="object",l.call(this,e,t,n)}function d(e,t,n){this.sym=["[","]"],this.type="array",l.call(this,e,t,n)}function h(e,t){this.wrapper=document.createElement("ul"),this.wrapper.className="jsontree_tree clearfix",this.rootNode=null,this.sourceJSONObj=e,this.loadData(e),this.appendTo(t)}return n.CONSTRUCTORS={boolean:o,number:r,string:i,null:a,object:c,array:d},s.prototype={constructor:s,mark:function(){this.el.classList.add("jsontree_node_marked")},unmark:function(){this.el.classList.remove("jsontree_node_marked")},toggleMarked:function(){this.el.classList.toggle("jsontree_node_marked")},expandParent:function(e){this.parent&&(this.parent.expand(),this.parent.expandParent(e))},getJSONPath:function(e){return this.isRoot?"$":(t="array"===this.parent.type?"["+this.label+"]":e?"."+this.label:"['"+this.label+"']",this.parent.getJSONPath(e)+t);var t}},t.inherits(o,s),t.inherits(r,s),t.inherits(i,s),t.inherits(a,s),t.inherits(l,s),t.extend(l.prototype,{constructor:l,addChild:function(e){this.childNodes.push(e),this.childNodesUl.appendChild(e.el),e.parent=this},expand:function(e){this.isEmpty||(this.isRoot||this.el.classList.add("jsontree_node_expanded"),e&&this.childNodes.forEach((function(t,n){t.isComplex&&t.expand(e)})))},collapse:function(e){this.isEmpty||(this.isRoot||this.el.classList.remove("jsontree_node_expanded"),e&&this.childNodes.forEach((function(t,n){t.isComplex&&t.collapse(e)})))},toggle:function(e){if(!this.isEmpty&&(this.el.classList.toggle("jsontree_node_expanded"),e)){var t=this.el.classList.contains("jsontree_node_expanded");this.childNodes.forEach((function(n,s){n.isComplex&&n[t?"expand":"collapse"](e)}))}},findChildren:function(e,t,n){this.isEmpty||this.childNodes.forEach((function(s,o){e(s)&&t(s),s.isComplex&&n&&s.findChildren(e,t,n)}))}}),t.inherits(c,l),t.inherits(d,l),h.prototype={constructor:h,loadData:function(e){t.isValidRoot(e)?(this.sourceJSONObj=e,this.rootNode=new n(null,e,"last"),this.wrapper.innerHTML="",this.wrapper.appendChild(this.rootNode.el)):alert("The root should be an object or an array")},appendTo:function(e){e.appendChild(this.wrapper)},expand:function(e){this.rootNode.isComplex&&("function"==typeof e?this.rootNode.childNodes.forEach((function(t,n){t.isComplex&&e(t)&&t.expand()})):this.rootNode.expand("recursive"))},collapse:function(){"function"==typeof this.rootNode.collapse&&this.rootNode.collapse("recursive")},toSourceJSON:function(e){if(!e)return JSON.stringify(this.sourceJSONObj);var t="[%^$#$%^%]",n=JSON.stringify(this.sourceJSONObj,null,t);return n=(n=n.split("\n").join("<br />")).split(t).join("&nbsp;&nbsp;&nbsp;&nbsp;")},findAndHandle:function(e,t){this.rootNode.findChildren(e,t,"isRecursive")},unmarkAll:function(){this.rootNode.findChildren((function(e){return!0}),(function(e){e.unmark()}),"isRecursive")}},{create:function(e,t){return new h(e,t)}}}();window.jsonTree=jsonTree;