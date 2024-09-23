<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRaw, watch } from "vue";
import { message, type FormInstance } from 'ant-design-vue';
import { openNotificationWithIcon } from "@/utils/notification";
import dayjs from "dayjs";

import { columns, selectOptions, categoryList, sort } from './constants'

// api
import { getDishTagList, addDishTag, updateDishTag, removeDishTagById } from '@/api/dish'


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
        formState.current = current;
        handleSearch();
    },
})

// 查询模块
interface SearchBody {
    tagName: string;
    tagType?: number | null;
    sort?: string;
    current: number;
    size: number;
}
const formRef = ref<FormInstance>();
const formState = reactive<SearchBody>({
  tagName: '',
  tagType: null,
  sort: 'asc',
  current: pagination.current,
  size: pagination.pageSize,
});
// 查询方法
const handleSearch = async () => {
    try{
        let res = await getDishTagList(formState);
        if (res.data.code === "0") {
            openNotificationWithIcon("success", "查询成功！", "标签查询成功！");
            dataSource.value = res.data.data.records;
            pagination.total = res.data.data.total;
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
    tagType: number;
    useCount?: number;
    category?: string;
}
let dataSource = ref<Tag[]>([])

const createTime = (timestamp: string) => {
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss'); 
}

// 模态框
interface Values {
  title?: string;
  description?: string;
  modifier?: string;
}
const modalFormRef = ref<FormInstance>();
let modalTitle = ref<string>('');
let visible = ref<boolean>(false);
let isCategory = computed(() => {
    return formData.tagType === 0;
})
let formData = reactive<Tag>({
    id: 0,
    tagName: '',
    tagType: 0,
    category: '',
});

const onOk = async () => {
    if (modalTitle.value === '新增标签') {
        try {
            const values = await modalFormRef.value.validateFields();
            await addDishTag(formData);
            visible.value = false;
            modalFormRef.value.resetFields();
            openNotificationWithIcon('success', '操作成功', '标签新增成功！')
        } catch (info) {
            console.log('Validate Failed:', info);
        }
    }else {
        try{
            const values = await modalFormRef.value.validateFields();
            let res = await updateDishTag(formData);
            visible.value = false;
            modalFormRef.value.resetFields();
            openNotificationWithIcon("success", "操作成功", "标签修改成功！");
        }catch(info){
            console.log('Validate Failed:', info);
        }
    }  
}

const onCancel = () => {
    visible.value = false;
    modalFormRef.value.resetFields();
    openNotificationWithIcon('info', '操作成功', `取消${modalTitle.value}`)
}

const handleTagTypeChange = (e: any) => {
    if (e === 1) {
        formData.category = '';
    }
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
    formData.tagType = tag.tagType;
    formData.category = tag.category
    modalTitle.value = '编辑标签'
    visible.value = true;
}
const handleRemove = async ({ id }) => {
    try{
        let data = await removeDishTagById(id);
        if (data.data.code === "0") {
            openNotificationWithIcon("success", "操作成功", "标签删除成功！");
        }else{
            openNotificationWithIcon("error", "操作失败", data.data.message);
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
                
                <a-col :span="5">
                    <a-form-item
                        name="tagType"
                        label="标签类型"
                    >
                    <a-select
                        v-model:value="formState.tagType"
                        style="width: 200px;"
                    >
                        <a-select-option 
                            v-for="item in selectOptions" 
                            :key="item.value"
                            :value="item.value"
                            >
                            {{ item.text }}
                        </a-select-option>
                    </a-select>
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


                <a-col class=" text-right" :span="4">
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

                        <template v-if="column.key === 'tagType'">
                            <a-tag :color="record.tagType === 1 ? '#2db7f5' : '#87d068'">{{ record.tagType === 1 ? '菜品标签' : '评分标签' }}</a-tag>
                        </template>
                        
                        <template v-if="column.key === 'createdTime'">
                            <a>{{ createTime(record.createdTime) }}</a>
                        </template>
                        
                        
                        <template v-if="column.key === 'action'">
                            <div class=" flex justify-around gap-2">
                            <a-button @click="handleCheck(record)" type="primary"><edit-outlined />编辑</a-button>
                            <a-button @click="handleRemove(record)" type="danger"><DeleteOutlined />删除</a-button>
                            </div>
                        </template>

                      
                    </template>
                </a-table>
            </div>

            <div>
                <a-modal
                    v-model:visible="visible"
                    :title="modalTitle"
                    ok-text="确认"
                    cancel-text="取消"
                    @ok="onOk"
                    @cancel="onCancel"
                >
                    <a-form ref="modalFormRef" :model="formData"  name="form_in_modal">
                        <a-form-item
                            name="tagName"
                            label="标签名称"
                            :rules="[{ required: true, message: '请输入标签名称!' }]"
                        >
                            <a-input v-model:value="formData.tagName" />
                        </a-form-item>

                        <a-form-item
                            name="tagType"
                            label="标签类型"
                            :rules="[{ required: true, message: '请选择标签类型！'}]"
                        >
                            <a-select 
                                v-model:value="formData.tagType"
                                @change="handleTagTypeChange"
                                >
                                <a-select-option 
                                    v-for="item in selectOptions"
                                    :key="item.value"
                                    :value="item.value"
                                    >{{ item.text }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item
                            name="category"
                            label="分类"
                            :rules="[{ required: isCategory, message: '请选择分类！'}]"
                            >
                            <a-select :disabled="!isCategory" v-model:value="formData.category">
                                <a-select-option 
                                    v-for="item in categoryList" 
                                    :key="item"
                                    :value="item"
                                    >{{ item }}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-form>
                </a-modal>
            </div>
    
        </div>
    </div>
</template>
