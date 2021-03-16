// Element-ui的组件在此按需引入
import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// //导入弹框提示组件
// import { Message } from 'element-ui'

import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main } from 'element-ui'

//注册
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

//message需要全局挂载
Vue.prototype.$message = Message;

