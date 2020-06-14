import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 所有的任务列表都在这里存储
        list: [],
        // 文本框的默认值
        inputValue: "111",
        // 下一个id
        nextId: 5,
        viewKey: 'all'
    },
    // mutations来为state中的list赋值 其中的函数第一个为state，第二个为传入state中的值
    mutations: {
        initList(state, list) {
            state.list = list;
        },
        // 为state中的inputValue赋值
        setInputValue(state, val) {
            state.inputValue = val;
        },
        addItem(state) {
            // 因为要放入数组中 所以我们需要建立一个对象
            const obj = {
                id: state.nextId,
                info: state.inputValue.trim(),
                dont: false
            }
            state.list.push(obj)
            state.nextId++
                state.inputValue = ''
        },
        // 根据id传递参数
        removeItem(state, id) {
            // 根据id查找对应项的索引 其中x为每次查找中数组中的一项 i就是我找到的数组中的一项索引值 有个疑问 传递过来的不就是id值为什么还要查找呢。暂时放下
            const i = state.list.findIndex(x => x.id === id)
                // 删除数组的固定操作
            if (i != -1) {
                state.list(i, 1)
            }
        },
        // 修改复选框的状态
        changeStatus(state, parma) {
            const i = state.list.findIndex(x => x.id === parma.id)
            if (i !== -1) {
                state.list[i].done = parma.status
            }
        },
        // 清楚已完成的任务
        cleanDone(state) {
            state.list = state.list.filter(x => x.done === false)
        },
        // 修改视图的关键字
        changeviewKey(state, key) {
            state.viewKey = key
        }
    },
    // actions中存放了是异步函数
    actions: {
        getList(context) {
            axios.get('/list.json').then(({ data }) => {
                console.log(data)
                    // 通过context.commit来触发，mutations中的函数initList
                    // data是会往list中传递的（第二个参数）
                context.commit('initList', data)
            })
        }
    },
    // getters主要是操作已经保存的数据进行操作 对其进行包装 只显示特定包装的数
    getters: {
        // 统计未完成的任务的条数 对数组进行筛选才是关键问题
        unDoneLength(state) {
            return state.list.filter(x => x.done === false).length
        },
        // 过滤数组中的数据进而去展示到页面中
        infoList(state) {
            if (state.viewKey === 'all') {
                return state.list
            }
            if (state.viewKey === 'undone') {
                return state.list.filter(x => !x.done)
            }
            if (state.viewKey === 'done') {
                return state.list.filter(x => x.done)
            }
            return state.list
        }
    }
})