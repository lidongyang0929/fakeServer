fakeData()
let model = {
  data:{
    name:'',
    number:0,
    id:'',
  },
  fetch(id){
    return axios.get(`/books/${id}`).then((response)=>{
      this.data = response.data
      return response
    })
  },
  update(data){
    let id= this.data.id
    return axios.put(`/books/${id}`,data).then((response)=>{
      this.data = response.data
      return response
  })
  
}}
let view = {
  el: '#app',
  template: `
  <div>
  名字:__name__
  数量:<span id=number>__number__</span>
  </div>
  <div>
  <button id=addOne>加一</button>
  <button id=minusOne>减一</button>
  </div>`,
  render(data){
  let html = this.template.replace('__name__',data.name)
  .replace('__number__',data.number)
  $(this.el).html(html)
}
}
let controller = {
  init({view,model}){
    this.view = view
    this.model = model
    this.view.render(this.model.data)
    this.bindEvents()
    this.model.fetch(1).then(({data})=>{
     view.render(data)
    })
  },
  bindEvents(){
    $(this.view.el).on('click','#addOne',this.addOne.bind(this)) 
    $(this.view.el).on('click','#minusOne',this.minusOne.bind(this)) 
  },                  
    addOne(){
    let oldNumber = $('#number').text()
    let newNumber = oldNumber -0 + 1
    this.model.update({number: newNumber}).then((response)=>{
        this.view.render(this.model.data)
      })
    },
    minusOne(){
    let oldNumber = $('#number').text()
    let newNumber = oldNumber -0 -1
    this.model.update({number: newNumber}).then((response)=>{
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