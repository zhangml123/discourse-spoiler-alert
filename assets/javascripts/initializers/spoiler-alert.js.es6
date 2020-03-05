import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";
import { ajax } from "discourse/lib/ajax";
function initialize(api) {
  const allow_user_locale = Discourse.SiteSettings.allow_user_locale;
  const currentUser = api.getCurrentUser();
  if(!allow_user_locale || !currentUser) return;
    
  
  alert(currentUser.get("username"))
  alert(Discourse.User.current().get("username"))
  var username = currentUser.get("username");

  api.createWidget("lang-list", {
    html(attrs){
      return h("li",{className:"set_li select-kit-row",lang:attrs.value},attrs.name);
    },
    click(event){
      
       alert(this.attrs.value)
       ajax("/u/" + username + ".json", {
            type: "PUT",
            data: {
              locale: this.attrs.value,
            }
            })
            .then((result) => {
              window.location.reload()
            })
            .catch(error => {
              if (error) {
              console.log(error)
              }
            })
            .finally(() => {});
    }

  })

  api.createWidget("lang-default", {
    html(){
      return h("span.set_span","中文");
    },
    click(){

    }

  })


  api.decorateWidget("header-buttons:before", helper => {
    var html = []
    const langs = JSON.parse(Discourse.SiteSettings.available_locales)
    langs.map(v =>{
      var item = helper.attach('lang-list',v) ;
      html.push(item) 
    })
    return h("div.select-kit.combo-box.set_div",
      [helper.attach('lang-default') ,
      h("ul.select-kit-collection.set_ul",html)]
    );
  });
}
export default {
  name: "theme",
  initialize() {
    withPluginApi("0.8.7", initialize);
  }
};
