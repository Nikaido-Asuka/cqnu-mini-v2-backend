<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance } from 'ant-design-vue';

// utils
import { openNotificationWithIcon } from '@/utils/notification'

// constants
import { columns, gradeList, college } from './constants'

// api
import { getUserList } from '@/api/user'

// components
import Modal from '@/components/modal'
import { grade } from '../todo/constants';

onMounted(async () => {
    handleSearch()
    // handleCheck({ id: 10 });
})

// 查询相关
interface SearchBody {
  username: string;
  faculty: string;
  grade?: number;
  current: number;
  pageSize: number;
}
const formRef = ref<FormInstance>();
const formState = reactive<SearchBody>({
  username: '',
  faculty: '',
  current: 1,
  pageSize: 10,
});

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  onChange: (current: number, pageSize: number) => {
    pagination.current = current;
    formState.current = current;
    handleSearch();
  },
})
const handleChange = (e: any) => {
  console.log(e);
}

const handleSearch = async () => {
    const body = {
        username: formState.username,
        faculty: formState.faculty,
        grade: formState.grade,
        current: pagination.current,
        pageSize:  pagination.pageSize,
    }

    try {
        let res = await getUserList(body)
        const { data: { data } } = res;
        pagination.total = data.total;
        dataSource.value = data.records;
        openNotificationWithIcon("success", "查询成功", "查询成功");
    } catch(error) {
        openNotificationWithIcon("error", "请求失败！", error.message);
    }
}

const handleClear = () => { 
    formRef.value.resetFields()
    handleSearch();
}


interface User {
  id: number;
  faculty: string;
  username: string;
  avatar: string;
  grade: number;
  major: string;
  stuClass: string;
}


let dataSource = ref<Array<User>>([])

// 删除相关
const showModal = ref(false);
let removeId = ref<number>(-1);
function handleConfirm() {
  handleRemove(removeId.value);
};
function handleModalCancel() {
  showModal.value = false;
};
function showConfirmRemove({ id }) {
    showModal.value = true;
    removeId.value = id;
}
function handleRemove(id: number) {
    dataSource.value = dataSource.value.filter(item => item.id !== id);
    // 删除接口
    showModal.value = false;
    openNotificationWithIcon("success", "删除成功！", "您已成功删除该用户！");
}

// 查看相关
let open = ref<boolean>(false);
let previewData = ref<User | null>(null);
const handleCancel = () => {
    open.value = false;
    previewData.value = {
      id: 0,
      faculty: '',
      username: '',
      avatar: '',
      grade: 0,
      major: '',
      stuClass: ''
    }
}
const handleCheck = ({ id }) => {
    open.value = true;
    previewData.value = dataSource.value.find(item => item.id === id);
    console.log(previewData.value);
}

// 年级计算属性映射
const getYearForGrade = (grade: number):string => {
    const result = gradeList.find(item => item.value === grade)
    return result.text;
}

</script>

<template>
  <div class="px-2 py-4">
    <a-form
      ref="formRef"
      name="advanced_search"
      class="ant-advanced-search-form"
      :model="formState"
      @finish="handleSearch"
    >
      <a-row :gutter="24">

        <a-col :span="5">
          <a-form-item
            name="username"
            label="用户名"
          >
          <a-input v-model:value="formState.username" placeholder="请输入用户名"/>
          </a-form-item>
        </a-col>

        <a-col :span="5">
          <a-form-item
            name="grade"
            label="年级"
            >
            <a-select
              v-model:value="formState.grade"
              @change="handleChange"
            >
              <a-select-option :value="item.value" v-for="item in gradeList" :key="item.text">{{ item.text }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="5">
          <a-form-item
            name="faculty"
            label="学院"
          >
          <a-select
              v-model:value="formState.faculty"
              @change="handleChange"
            >
              <a-select-option :value="item" v-for="item in college" :key="item">{{ item }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>


        <a-col class=" text-right" :span="9">
          <a-button type="primary" html-type="submit">
            <SearchOutlined />
            搜索
          </a-button>
          <a-button style="margin: 0 8px" @click="handleClear">
            <ClearOutlined />
            清空
          </a-button>
        </a-col>

        
      </a-row>
    </a-form>

    <div style="overflow-x: auto;">
      <a-table 
        :scroll="{ x: 1500, y: 800 }" 
        :dataSource="dataSource" 
        :columns="columns"
        :pagination="pagination"
        >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'avatar'">
            <img class=" w-[80px] h-[80px] rounded-[8px]" :src="record.avatar ? record.avatar : 'https://pic.imgdb.cn/item/6537b017c458853aefecf6c3.png' " alt=""/>
          </template>

          <template v-if="column.key === 'username'">
            <a href="javascript:;">{{ record.username }}</a>
          </template>

          <template v-if="column.key === 'grade'">
            <span v-if="record.grade">{{ record.grade }}</span>
            <span v-else>暂无数据</span>
          </template>

          <template v-if="column.key === 'action'">
            <div class="flex justify-evenly items-center">
              <a-button @click="handleCheck(record)" type="primary"><EyeOutlined />查看</a-button>
              <a-button @click="showConfirmRemove(record)" type="danger"><DeleteOutlined />删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <a-modal 
      :visible="open" 
      title="用户信息" 
      @ok="handleCancel" 
      @cancel="handleCancel"
      okText="确认"
      cancelText="取消"
      width="800px"
      >
      <div class="px-5 py-5 w-full flex gap-10 justify-between items-stretch">
        <div class="left flex flex-col items-center">
            <img class="w-[150px] h-[150px]" :src="previewData.avatar ? previewData.avatar : 'https://pic.imgdb.cn/item/6537b017c458853aefecf6c3.png'" alt="" />
        </div>

        <div class="right w-full px-1 py-3">
            <a-row class=" mb-5" :span="24">
                <a-col class="text-[20px]" :span="12">
                    <label>用户名：</label>
                    <a href="javasript:;">{{ previewData.username }}</a>
                </a-col>
                <a-col class="text-[20px]" :span="12">
                    <label>学院：</label>
                    <span>{{ previewData.faculty ? previewData.faculty : '暂无信息' }}</span>
                </a-col>
            </a-row>

            <a-row class=" mb-5" :span="24">
                <a-col class="text-[20px]" :span="12">
                    <label>年级：</label>
                    <span>{{ previewData.grade ? previewData.grade : '暂无信息' }}</span>
                </a-col>
                <a-col class="text-[20px]" :span="12">
                    <label>专业：</label>
                    <span>{{ previewData.major ? previewData.major : '暂无信息' }}</span>
                </a-col>
            </a-row>

            <a-row :span="24">
                <a-col class="text-[20px]" :span="24">
                    <label>班级：</label>
                    <span>{{ previewData.stuClass ? previewData.stuClass : '暂无信息' }}</span>
                </a-col>
            </a-row>
        </div>
    </div>

    </a-modal>

    <Modal 
      :visible="showModal" 
      title="你确定要删除这个用户吗？"
      @update:visible="showModal = $event"
      @confirm="handleConfirm"
      @cancel="handleModalCancel"
    >
      <template #body>
        <p class=" text-red-500 text-[17px]">确认删除后无法撤回，该用户信息会永久删除！</p>
      </template>
    </Modal>
  </div>
</template>



<style scoped>
#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
</style>
