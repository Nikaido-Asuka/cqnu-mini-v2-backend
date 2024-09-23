<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { message, type FormInstance } from 'ant-design-vue';
import { columns, options, sort } from './constans'

// components
import Modal from '@/components/modal'

// api
import { updateTodoTag, addTodoTag, getTodoTagList, removeTodoTagById } from '@/api/todo'
import { openNotificationWithIcon } from "@/utils/notification";
import dayjs from "dayjs";

onMounted(() => {
    handleSearch();
})

// 分页
const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (current: number, pageSize: number) => {
        pagination.current = current;
    },
})

// 查询模块
interface SearchBody {
    tagName: string;
    sort: string;
    current: number;
    size: number;
}
const formRef = ref<FormInstance>();
const formState = reactive<SearchBody>({
  tagName: '',
  sort: 'asc',
  current: pagination.current,
  size: pagination.pageSize,
});
// 查询方法
const handleSearch = async () => {
    try{
        let res = await getTodoTagList(formState);
        console.log(res);
        if (res.data.code === "0") {
            openNotificationWithIcon("success", "查询成功！", "标签查询成功！");
            dataSource.value = res.data.data.records;
        }else{
            openNotificationWithIcon("error", "查询失败！", res.data.message);
        }
    }catch(err) {
        openNotificationWithIcon('error', '错误', err.message);
    }
}
// 排序方法改变
const handleSortChange = () => {
    handleSearch();
}


// 表格相关
interface Tag {
    id?: number;
    tagName: string;
    useCount?: number;
    createdTime?: string;
}
let dataSource = ref<Tag[]>([])

const createTime = (timestamp: string) => {
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss'); 
}

// 模态框
const modalFormRef = ref<FormInstance>();
let modalTitle = ref<string>('');
let visible = ref<boolean>(false);
let formData = reactive<Tag>({
    id: 0,
    tagName: '',
});

const handleOk = async () => {
    visible.value = false;
    console.log(formData);
    // 添加接口
    if (modalTitle.value === '新增标签'){
        await addTodoTag(formData.tagName);
        const item = {
            tagName: formData.tagName,
            useCount: 0,
            createdTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        dataSource.value.push(item);
      
    }else{
        await updateTodoTag(formData);
        const tag = dataSource.value.find(item => item.id === formData.id);
        tag.tagName = formData.tagName;
    }
    openNotificationWithIcon('success', '操作成功', '修改成功！');
    formData.id = 0;
    formData.tagName = '';
}
const handleCancel = () => {
    visible.value = false;
    // modalFormRef.value.resetFields();
    formData.id = 0;
    formData.tagName = '';
    openNotificationWithIcon("info", "取消新建标签", "取消新建标签！")
}

// 标签增删改相关
const handleAdd = () =>{
    modalTitle.value = '新增标签';
    visible.value = true;
}
const handleCheck = ({ id }) => {
    const tag = dataSource.value.find(item => item.id === id)
    formData.id = id;
    formData.tagName = tag.tagName
    modalTitle.value = '编辑标签'
    visible.value = true;
}
const handleRemove = async ({ id }) => {
    console.log(id);
    try{
        let data = await removeTodoTagById(id);
        if (data.data.code === "0") {
            openNotificationWithIcon("success", "删除成功！", "删除成功！");
            handleSearch();
        }else{
            openNotificationWithIcon("error", "删除失败！", data.data.message);
        }
    }catch(err) {
        openNotificationWithIcon('error', '错误', err.message);
    }
}



</script>

<template>
    <div>
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
                        name="tagName"
                        label="标签名称"
                    >
                    <a-input
                        v-model:value="formState.tagName"
                        placeholder="请输入标签名"
                        style="width: 200px"
                    />
                    </a-form-item>
                </a-col>

                <a-col :span="10">
                    <a-form-item
                        name="sort"
                        label="排序方式"
                    >
                    <a-radio-group 
                        v-model:value="formState.sort" 
                        button-style="solid"
                        @change="handleSortChange"
                        >
                        <a-radio-button 
                            v-for="item in sort" 
                            :value="item.value"
                            :key="item.value"
                            >{{ item.text }}
                        </a-radio-button>
                    </a-radio-group>
                        
                    </a-form-item>
                </a-col>


                <a-col class=" text-right" :span="9">
                    <a-button type="primary" html-type="submit">
                        <SearchOutlined />
                        搜索
                    </a-button>
                    <a-button @click="handleAdd" style="margin: 0 8px" >
                        <PlusOutlined />
                        新建
                    </a-button>
                </a-col>

                
            </a-row>
            </a-form>

            <div style="overflow-x: auto;">
                <a-table 
                    :scroll="{ y: 800 }" 
                    :dataSource="dataSource" 
                    :columns="columns"
                    :pagination="pagination"
                    >
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'action'">
                            <div class=" flex justify-around gap-2">
                            <a-button @click="handleCheck(record)" type="primary"><edit-outlined />编辑</a-button>
                            <a-button @click="handleRemove(record)" type="danger"><DeleteOutlined />删除</a-button>
                            </div>
                        </template>

                        <template v-if="column.key === 'createdTime'">
                            <a>{{ createTime(record.createdTime) }}</a>
                        </template>
                    </template>
                </a-table>
            </div>

            <a-modal 
                v-model:visible="visible" 
                :title="modalTitle" 
                @ok="handleOk"
                @cancel="handleCancel"
                ok-text="确认"
                cancel-text="取消"
                >
                <a-form
                   ref="modalFormRef"
                   :model = "formData"
                >
                    <a-form-item
                        label="标签名称"
                        name="name"
                    >
                        <a-input v-model:value="formData.tagName" />
                    </a-form-item>


                </a-form>
            </a-modal>
    
        </div>
    </div>
</template>
