<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import type { UploadFile } from 'ant-design-vue';

// dayjs
import dayjs, { Dayjs } from 'dayjs';

// utils
import { openNotificationWithIcon } from '@/utils/notification'
import { beforeUpload } from '@/utils/utils';

// constants
import { columns, timespan, tagColor } from './constants'

// api
import { getTodoList, removeTodoById, updateTodo } from '@/api/todo'
import { upLoadFile } from '@/api/upload'
import Todo from '.'

// interface
interface Tag {
    createdTime: string;
    updatedTime: string;
    isDelete: number,
    id: number,
    tagName: string;
    noteId?: number;
}

interface Todo {
    id: number;
    title: string;
    content: string;
    imagesUrl: string[];
    courseName: string;
    openid: string;
    deadline: string | Dayjs;
    seeNumber: number;
    supportNumber: number;
    tagList: Array<Tag>;
}

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  onChange: (current: number, pageSize: number) => {
    pagination.current = current;
    handleSearch();
  },
})

onMounted(() => {
    handleSearch();
})

let dataSource = ref<Array<Todo>>([])




// 查询相关
interface SearchBody {
  courseName: string;
  timespan?: Array<Dayjs>;
  current: number;
  pageSize: number;
}
const formRef = ref<FormInstance>();
const formState = reactive<SearchBody>({
  courseName: '',
  current: pagination.current,
  pageSize: pagination.pageSize,
});

const handleSearch = async () => {

  const courseName = formState.courseName && formState.courseName
      ? formState.courseName
      : '';

  const startDate = formState.timespan && formState.timespan[0]
      ? dayjs(formState.timespan[0]).format('YYYY-MM-DD HH:mm:ss')
      : '';

  const endDate = formState.timespan && formState.timespan[1]
      ? dayjs(formState.timespan[1]).format('YYYY-MM-DD HH:mm:ss')
      : '';

  const body = {
      courseName,
      startDate,
      endDate,
      current: pagination.current,
      pageSize: pagination.pageSize,
  };

  try{
      let res = await getTodoList(body);
      console.log(res);
      if (res.data.code === "0") {
        const { data: { data } } = res;
        dataSource.value = data.noteRespIPage.records;
        pagination.total = data.totalCount;
        openNotificationWithIcon("success", "查询成功！", "查询成功！");
      } 
  }catch(err){
      openNotificationWithIcon('error', '获取数据失败', err.message);
  }
}



// 删除
function handleRemove({ id }) {
    removeTodoById(id).then(res => {
      openNotificationWithIcon('success', '删除成功', '')
      dataSource.value = dataSource.value.filter(item => item.id !== id);
    }).catch(err => {
      openNotificationWithIcon('error', '删除失败', err.message)
    })
} 



// 查看相关
let open = ref<boolean>(false);
let previewData = ref<Todo | null>(null);
let removeTagList = ref<Array<number>>([]);
const handleCancel = () => {
    open.value = false;
    previewData.value = null;
    imageUrl.value = '';
}
const handleConfirm = () => {
    previewData.value.tagList = previewData.value.tagList.filter(item => !removeTagList.value.includes(item.id));
    previewData.value.deadline = previewData.value.deadline.format('YYYY-MM-DD HH:mm:ss');
    console.log(previewData.value);

    // 调用修改接口
    updateTodo(previewData.value).then(res => {
      open.value = false;
      previewData.value = null;
      removeTagList.value = [];
      if (res.code === 'A000504') {
        openNotificationWithIcon('warning', res.message, res.message + '，无法修改！');
        return ;
      }
      openNotificationWithIcon('success', '修改成功！', '成功修改小记的信息！')
      imageUrl.value = '';
    }).catch(err => {
      openNotificationWithIcon('error', '修改失败！', err.message)
    })

}
const handleCheck = ({ id }) => {
    open.value = true;
    previewData.value = dataSource.value.find(item => item.id === id);
    previewData.value.deadline = dayjs(previewData.value.deadline)
    removeTagList.value = [];
}

const handleTagClose = (id: number) => {
    removeTagList.value.push(id);
}


// 图片上传相关
import { useUploadFile } from '@/hooks/useUploadFile'
const { loading, imageUrl, handleChange } = useUploadFile();
const fileList = ref<UploadFile[]>([]);

const customRequest = async (options) => {
    console.log(options);
    const { file, onSuccess, onError, onProgress } = options;

    const formData = new FormData();
    formData.append('uploadFile', file as any);
    formData.append('bucket', 'cqminiv2-imgs');
    formData.append('objectName', 'note');

    try{
        let res = await upLoadFile(formData);
        console.log(res);
        console.log(imageUrl);
        if (res.data.code === "0") {
            imageUrl.value = res.data.data;
            previewData.value.imagesUrl.push(res.data.data);
            openNotificationWithIcon("success", "上传成功！", "文件上传成功！");
        }
    }catch(err) {
        message.error("上传失败!")
    }

};

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
            name="courseName"
            label="课程名称"
          >
          <a-input v-model:value="formState.courseName" placeholder="请输入课程名称"/>
          </a-form-item>
        </a-col>

        <a-col :span="5">
          <a-form-item
            name="timespan"
            label="时间"
          >
          <a-range-picker  class=" w-full" v-model:value="formState.timespan" />
          </a-form-item>
        </a-col>

        


        <a-col class=" text-right" :span="14">
          <a-button type="primary" html-type="submit">
            <SearchOutlined />
            搜索
          </a-button>
          <a-button style="margin: 0 8px" @click="() => formRef.resetFields()">
            <ClearOutlined />
            清空
          </a-button>
        </a-col>

        
      </a-row>
    </a-form>

    <div style="overflow-x: auto;">
      <a-table 
        :scroll="{ x: 1700, y: 800 }" 
        :dataSource="dataSource" 
        :columns="columns"
        :pagination="pagination"
        >
        <template #bodyCell="{ column, record }">

          <template v-if="column.key === 'imagesUrl'">
            <img class=" w-full rounded-[8px]" :src="record.imagesUrl[0]" alt=""/>
          </template>

          <template v-if="column.key === 'count'">
            <div class=" flex justify-between items-center">
              <div class=" item text-green-500">
                <EyeOutlined />
                浏览&nbsp;{{ record.seeNumber }}
              </div>
              <div class=" item text-blue-500">
                <LikeOutlined />
                点赞&nbsp;{{ record.supportNumber }}
              </div>
            </div>
          </template>


          <template v-if="column.key === 'action'">
            <div class=" flex justify-around gap-2">
              <a-button @click="handleCheck(record)" type="primary"><edit-outlined />编辑</a-button>
              <a-button @click="handleRemove(record)" type="danger"><DeleteOutlined />删除</a-button>
            </div>
          </template>

          <template v-if="column.key === 'tag'">
            <div class=" flex flex-col justify-center items-center gap-2">
              <a-tag class=" w-[50px]" v-for="(item, index) in record.tagList" :key="item" :color="tagColor[index]">{{ item.tagName }}</a-tag>
            </div>
          </template>

        </template>
      </a-table>
    </div>
      

    <a-modal 
      :visible="open"
      width="600px" 
      title="小记详情信息" 
      @ok="handleConfirm" 
      @cancel="handleCancel"
      cancelText="取消"
      okText="确认"
      >
        <div>
          <a-form
            name="advanced_search"
            :model="previewData"
          >

          <a-form-item
            name="title"
            label="小记标题"
          >
            <a-input v-model:value="previewData.title"/> 
          </a-form-item>

          <a-form-item
            name="content"
            label="小记内容"
          >
            <a-input v-model:value="previewData.content"/> 
          </a-form-item>

          <a-form-item
            name="imagesUrl"
            label="小记图片"
          >
          <div>
            <a-upload
                v-model:file-list="fileList"
                name="file"
                :show-upload-list="false"
                :custom-request="customRequest"
                :before-upload="beforeUpload"
                @change="handleChange"
            >
                <img class=" w-[485px] h-[250px]" v-if="imageUrl" :src="imageUrl" alt="note-img" />
                <div class=" w-[485px] h-[250px] text-[30px]  rounded-[8px] bg-[#efefef] flex flex-col justify-center items-center gap-2"  v-else>
                    <loading-outlined class=" text-[40px]" v-if="loading"></loading-outlined>
                    <download-outlined class=" text-[40px]" v-else></download-outlined>
                    <div>上传</div>
                </div>
            </a-upload>
          </div>
            
          </a-form-item>

          <a-form-item
            name="deadline"
            label="截止日期"
          >
            <a-date-picker class=" w-full" format="YYYY-MM-DD HH:mm:ss" v-model:value="previewData.deadline" />
          </a-form-item>

          <a-form-item
            name="courseName"
            label="课程名称"
          >
            <a-input v-model:value="previewData.courseName"/> 
          </a-form-item>

          <a-form-item
            name="deadline"
            label="标签tags"
          >
            <div class="">
              <a-tag 
                  class=" py-1 px-3" v-for="(item, index) in previewData.tagList" 
                  :key="item.id" 
                  :color="tagColor[index + 1]"
                  :closable="true"
                  @close="handleTagClose(item.id)"
                  >{{ item.tagName }}</a-tag>
            </div>
          </a-form-item>
          </a-form>
        </div>
    </a-modal>
  </div>
</template>



<style scoped>
#components-form-demo-advanced-search .ant-form {
  max-width: none;
}
</style>
