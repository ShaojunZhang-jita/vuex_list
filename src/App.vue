<template>
  <div id="app">
    <a-input placeholder="请输入任务" class="my_ipt" :value="inputValue" @change="handleInputChange"/>
    <a-button type="primary" @click="addItemToList">添加事项</a-button>
    <a-list bordered :dataSource="infoList" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <a-checkbox :checked='item.done' @change="(e)=>{
          cbStatusChanged(e, item.id)}">{{item.info}}</a-checkbox>
        <!-- 删除链接  事件函数中的参数都是传递的id-->
        <a slot="actions" @click="removeItemById(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{unDoneLength}}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <a-button :type="viewKey === 'all'?'primary':'default'" @click="changList(all)">全部</a-button>
          <a-button :type="viewKey === 'undone'?'primary':'default'" @click="changLis(undone)">未完成</a-button>
          <a-button :type="viewKey === 'done'?'primary':'default'" @click="changList(done)">已完成</a-button>
        </a-button-group>
        <!-- 把已经完成的任务清空 -->
        <a>清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
// mapState是vuex中的一个模块
// 它为一个函数放置在计算属性中 vuex中有state和getters的都需要调用mapState以及mapGetters
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'app',
  data() {
    return {
    // 清空了，按需导入从vuex中传递来的数组即可
    }
  },
  created() {
    this.$store.dispatch('getList')
  },
  //必须要用计算属性将state中的数据引用过来然后才可以使用 比如插值表达式以及动态绑定的属性中的数据等 比如此时viewKey可以发生变化了，就可以绑定属性了。
  computed: {
    // 将state中的数据映射过来 
    ...mapState(['inputValue', 'viewKey']),
    // getters中的成员进行映射过来 注意函数有返回值之后放置在数据中不用括号的
    ...mapGetters(['infoList', 'unDoneLength'])
  },
  methods: {
    handleInputChange(e) {
      console.log(e.target.value);
      // 调用vuex中的mutations的方法就是利用$store.dispath
      this.$store.dispatch('setInputValue',e.target.value)
      
    },
    // 像列表中新增一些数据
    addItemToList() {
      // 判断输入的值 注意输入的值 已经 又计算属性将其引入过来了
      if(this.inputValue.trim().length<=0) {
        // 则输入框为空 利用方法在窗口进行打印结果
        let a = this.$message.warning('文本框内容为空');
        return a;
      }
      // 调取mutations中的函数 即新增数据函数
      this.$store.commit('addItem')
    },
    // 根据id删除对应的任务
    removeItemById(id) {
      // 验证一下id是否被传递
      console.log(id);
      // 调取mutation中的函数进行操作数据
      this.$store.commit('removeItem',id)
    },
    // 复选框发生变化即勾选或者否的时候执行的函数 因为change是改变之后的状态，当点击复选框的时候，发生变化，这个时候状体也发生变化（有点模糊，暂时放置）
    cbStatusChanged(e, id) {
      // 通过e.target.checked可以得到最小的复选框状态
      // console.log(e.target.checked);
      // 打印得到哪一个复选框中的id 基本id都是从上面传递下来的
      // console.log(id);
      const param = {
        id: id,
        status: e.target.checked
      }
      // 触发mutations中的函数 第一个参数为调取的函数 第二个参数为传入的参数
      this.$store.commit('changeStatus', param)
      
    },
    // 给三个按钮绑定事件，传递参数值
    changLis(key) {
      // 打印出来看看
      // console.log(key);
      // 触发mutations中的事件改变vuex中的数据
      this.$store('changeviewKey',key)
    }
  }
}
</script>

<style scoped>
#app {
  padding: 10px;
}

.my_ipt {
  width: 500px;
  margin-right: 10px;
}

.dt_list {
  width: 500px;
  margin-top: 10px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

