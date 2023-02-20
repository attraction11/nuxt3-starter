<template>
  <the-header></the-header>
  <div class="px-2 py-3 h-[calc(100vh)] bg-red-200 pt-14 flex flex-col">
    <div
      class="h-40 relative bg-gray-300 mt-3 flex justify-center items-center basis-full"
    >
      <div>{{ $t("lottery.title") }}</div>
      <p class="absolute bottom-3 right-3">{{ $t("lottery.subTitle") }}</p>
    </div>
    <div class="lg:min-h-screen flex items-center justify-center pt-10">
      <div id="turntable" class="overflow-hidden"></div>
      <img
        src="/img/btn.png"
        alt="lottery"
        class="absolute w-20 top-1/2 left-1/2 -ml-11 -mt-12 outline-none"
      />
    </div>
    <div
      class="text-center basis-full flex flex-col justify-center items-center"
    >
      <p class="pb-10">
        {{
          LotteryNum ? $t("lottery.tipOne", LotteryNum) : $t("lottery.tipTwo")
        }}
      </p>
      <el-button color="#333" class="w-1/2" size="large" @click="luckyDraw">{{
        $t("lottery.btnTxt")
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ElButton } from "element-plus";
import Turntable from "@/utils/turntable";
import { ElMessage } from "element-plus";
import { api } from "~/api/api";
import { sleep } from "@antfu/utils";
import { JackpotVO } from "~/types/lottery";

const { t, locale } = useLang();
const LotteryNum = ref(0); // 标记抽奖次数

// 1、获取奖池信息
let jackpotList = reactive<JackpotVO[]>([]);
let { data: jackpotInfo } = await api.lottery.getJackpotInfo();

function CompoundInfo(list: []) {
  // 处理奖池信息为展示数据
  jackpotList = [];
}
CompoundInfo(jackpotInfo);

// 2、判断用户是否登录
let { data: userInfo } = await api.lottery.getUserInfo();

// 3、获取抽奖次数
let { data: jackpotNum } = await api.lottery.getLotteryNum();
LotteryNum.value = jackpotNum;

const turntable = new Turntable({
  type: "transition",
  size: 320,
  textSpace: 15,
  imgSpace: 54,
  values: [
    {
      id: 0,
      name: "感谢参与",
      img: {
        width: 50,
        height: 50,
        src: "img/thanks.png",
      },
      color: "#fc796f",
      bg: "#fffdeb",
    },
    {
      id: 1,
      name: "M+T恤",
      img: {
        width: 45,
        height: 57,
        src: "img/tshirt.png",
      },
      color: "#fbe0e1",
      bg: "#ed6e71",
    },
    {
      id: 2,
      name: "太空杯",
      img: {
        width: 45,
        height: 57,
        src: "img/cup.png",
      },
      color: "#fc796f",
      bg: "#fffdeb",
    },
    {
      id: 3,
      name: "电影券",
      img: {
        width: 50,
        height: 35,
        src: "img/movie.png",
      },
      color: "#fbe0e1",
      bg: "#ed6e71",
    },
    {
      id: 0,
      name: "感谢参与",
      img: {
        width: 50,
        height: 50,
        src: "img/thanks.png",
      },
      color: "#fc796f",
      bg: "#fffdeb",
    },
    {
      id: 4,
      name: "魅族雨伞",
      img: {
        width: 50,
        height: 35,
        src: "img/umbrella.png",
      },
      color: "#fbe0e1",
      bg: "#ed6e71",
    },
    {
      id: 5,
      name: "Pro 5",
      img: {
        width: 30,
        height: 60,
        src: "img/pro5.png",
      },
      color: "#fc796f",
      bg: "#fffdeb",
    },
    {
      id: 6,
      name: "魅蓝metal",
      img: {
        width: 30,
        height: 57,
        src: "img/metal.png",
      },
      color: "#fbe0e1",
      bg: "#ed6e71",
    },
  ],
});

onMounted(() => {
  turntable.draw(document.getElementById("turntable"));
});

// 用户抽奖
const luckyDraw = async () => {
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    // GA 埋点
    event: "activity.lottery",
    ecommerce: {},
  });

  if (!userInfo) {
    ElMessage.error(t("lottery.loginTip"));
    return navigateTo("/login");
  }

  const startTime = new Date().valueOf();
  // 去后台获取抽奖结果
  let { data: prize } = await api.lottery.getLotteryResult();
  const endTime = new Date().valueOf();

  const interval = endTime - startTime;

  if (interval < 3000) {
    await sleep(interval);
  }

  const index = jackpotList.findIndex((item) => item.id === prize.id);
  turntable.goto(index, function (val: any) {
    console.log(val);
    ElMessage.success(t("lottery.prizeTip", { name: val.name }));
  });
};
</script>
