fakeData()
function Model(options){
    this.data = options.data
    this.resource = options.resource
  }
  Model.prototype.fetch = function(id){
    return axios.get(`/${this.resource}s/${id}`).then((response)=>{
        this.data = response.data
        return response
      })
  }
  Model.prototype.update = function(data){
     let id= this.data.id
      return axios.put(`/${this.resource}s/${id}`,data).then((response)=>{
        this.data = response.data
        return response
    })}
  function View({el,template}){
    this.el = el
    this.template = template
  }
 View.prototype.render = function(data){
   let html = this.template
   for(let key in data){
     html = html.replace(`__${key}__`,data[key])
   }
   $(this.el).html(html)
 }
// ---------------- 以上是MVC类

 let model = new Model({data:{name:'',number:0,id:''},resource:'book'})
 let view = new View({
   el: '#app',
   template: `
   <div>
   名字:__name__
   数量:<span id=number>__number__</span>
   </div>
   <div>
     <button id=addOne>加一</button>
     <button id=minusOne>减一</button>
   </div>`
  })
let controller = {
  init({view,model}){
    this.view = view
    this.model = model
    this.view.render(this.model.data)
    this.model.fetch(1).then(()=>{
     this.view.render(this.model.data)
    })
    this.bindEvents()
  },
  bindEvents(){
    $(this.view.el).on('click','#addOne',this.addOne.bind(this)) 
    $(this.view.el).on('click','#minusOne',this.minusOne.bind(this)) 
  },                  
    addOne(){
    var oldNumber = $('#number').text()
    var newNumber = oldNumber - 0 + 1
    this.model.update({number: newNumber}).then((response)=>{
        this.view.render(this.model.data)
      })
    },
    minusOne(){
    var oldNumber = $('#number').text()
    var newNumber = oldNumber -0 -1
    this.model.update({number: newNumber}).then(()=>{
        this.view.render(this.model.data)
      })
    }}

  
  controller.init({view: view,model: model})



function fakeData(){
  let book = {
    name:'JavaScript高级程序语言设计',
    number:1,
    id:1
  }
  axios.interceptors.response.use(function(response){
    let {config:{method,url,data}} = response
    if(url === '/books/1' && method ==='get'){
      response.data = book
    }else if(url === '/books/1' && method ==='put'){
      data = JSON.parse(data)
      Object.assign(book,data)
      response.data = book
    }
    return response
   
  })
}