<script setup lang="ts">
import { getAnnouncementList, addAnnouncment } from '@/api/announcement'
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance } from 'ant-design-vue';

import { columns, severityMap } from './constants'
import { openNotificationWithIcon } from '@/utils/notification';


onMounted(() => {
    handleGetAnnouncementList();
})  
interface Announcement {
    title: string;
    snippet: string;
    content: string;
    severity: string;
}
const dataSource = ref<Announcement[]>([]);

const handleAdd = () => {
    visible.value = true;
    modalTitle.value = '新建公告';
}

const handleGetAnnouncementList = async () => {
    const { data } = await getAnnouncementList({current: 1, size: 10, });
    dataSource.value = data.data.records;
}

// 模态框相关
const formRef = ref<FormInstance>();
const formState = ref<Announcement>({
    title: '9月25日开发者周报',
    snippet: '智慧重师V2后台管理系统公告模块开发测试',
    content: '智慧重师V2后台管理系统公告模块开发测试',
    severity: 'low'
})

let visible = ref<boolean>(false);
let modalTitle = ref<string>('');
const handleOk = async () => {
    try{
        const value = await formRef.value.validateFields()
        console.log(formState.value);
        const { data } =  await addAnnouncment(formState.value);
        console.log(data)
        if (data.code === '0') {
            formRef.value.resetFields();
            openNotificationWithIcon('success', '操作成功', '公告添加成功！');
            dataSource.value.unshift(formState.value);
            visible.value = false;
        }else {
            openNotificationWithIcon('error', '操作失败', '公告添加失败！');
        }
    }catch(error) {
    }
}

const handleCancel = () => {
    visible.value = false;
}


</script>

<template>
    <div>
        <a-form
            name="advanced_search"
            class="ant-advanced-search-form"
            >
            <a-row :gutter="24">
                <a-col class=" text-right" :span="24">
                    <a-button type="primary" @click="handleAdd">
                        <SearchOutlined />
                        新建公告
                    </a-button>
                </a-col>

                
            </a-row>
        </a-form>


        <div class=" mt-2" style="overflow-x: auto;">
            <a-table
                :columns="columns"
                :dataSource="dataSource"
                :scroll="{ x: 1300, y: 800 }" 
                >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'severity'">
                        <a-tag :color="severityMap[record.severity]">{{ record.severity }}</a-tag>
                    </template>

                    <template v-if="column.dataIndex === 'action'">
                        <div class=" flex justify-between items-center">
                            <a-button type="primary">
                                <EyeOutlined />
                                查看
                            </a-button>
                            <a-button type="danger">
                                <DeleteOutlined />
                                删除
                            </a-button>
                        </div>
                    </template>
                </template>
            </a-table>
        </div>


        <a-modal
            :visible="visible"
            okText="发布"
            cancelText="取消"
            @ok="handleOk"
            @cancel="handleCancel"
            :title="modalTitle"
            >
            <a-form
                ref="formRef"
                :model="formState"
            >
            <a-form-item
                name="title"
                label="公告标题"
                :rules="[{ required: true, message: '请输入公告名称!' }]"
            >
                <a-input v-model:value="formState.title"/> 
            </a-form-item>
            
            <a-form-item
                name="snippet"
                label="公告片段"
                :rules="[{ required: true, message: '请输入公告片段!' }]"
            >
                <a-input v-model:value="formState.snippet"/> 
            </a-form-item>      

            <a-form-item
                name="content"
                label="公告内容"
                :rules="[{ required: true, message: '请输入公告内容!' }]"
            >
                <a-input v-model:value="formState.content"/> 
            </a-form-item>      

            <a-form-item
                name="severity"
                label="公告类型"
                @change="(e) => console.log(e)"
                :rules="[{ required: true, message: '请选择公告类型!' }]"
            >
                <a-select
                    v-model:value="formState.severity"
                >
                    <a-select-option 
                        v-for="(_, key) in severityMap"
                        :key="key"
                        :value="key"
                        >{{ key }}</a-select-option>
                </a-select>
            </a-form-item>      
            </a-form>
        </a-modal>
    </div>
</template>