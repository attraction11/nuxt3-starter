<template>
  <div class="bg-red-500 max-w-md index-wrap min-h-screen">
    <!-- <the-header></the-header> -->
    <div
      class="px-2 py-3 activity_bg bg-cover flex flex-col justify-between"
      :style="loadBgImg('/img/activity-bg.webp')"
    >
      <div class="text-white text-xl mb-4">
        <div class="mt-4 mb-2">
          <img
            :src="`${ossImg}/img/${lang}-lottery-title.webp`"
            alt="lottery"
            class="w-full"
          />
        </div>
        <p class="text-center text-base">
          {{ $t("lottery.subTitle") }}
        </p>
      </div>
      <div
        class="flex items-center justify-center turntable-wrap pb-28"
        :style="loadBgImg('/img/base-bg.webp')"
      >
        <div
          id="turntable"
          class="overflow-hidden p-10"
          :style="[
            loadBgImg('/img/plate-bg.webp'),
            { '--bgurl': 'url(' + ossImg + '/img/btn.webp)' },
          ]"
        ></div>
      </div>
      <div class="text-center flex flex-col justify-center items-center">
        <el-button
          color="#fdedce"
          class="w-1/2"
          size="large"
          @click="luckyDraw"
          :disabled="isDisable"
          ><span class="text-red-600 font-bold text-lg">{{
            $t("lottery.btnTxt")
          }}</span></el-button
        >
        <p
          class="pt-4 text-white text-xs text-center"
          v-html="lotteryNumTip"
        ></p>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title=""
      width="90%"
      center
      align-center
      class="lotteryWarp"
      :style="loadBgImg('/img/dialog-bg.webp')"
    >
      <p
        class="py-4 px-8 text-left text-base text-center"
        v-html="winningTips"
      ></p>
      <span
        class="inline-block pl-2 absolute right-[18%] top-[72px]"
        v-show="couponCode"
        @click="handleCopyCode(couponCode)"
      >
        <svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          data-v-029747aa=""
          width="18px"
        >
          <path
            fill="currentColor"
            d="M128 320v576h576V320H128zm-32-64h640a32 32 0 0 1 32 32v640a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V288a32 32 0 0 1 32-32zM960 96v704a32 32 0 0 1-32 32h-96v-64h64V128H384v64h-64V96a32 32 0 0 1 32-32h576a32 32 0 0 1 32 32zM256 672h320v64H256v-64zm0-192h320v64H256v-64z"
          ></path>
        </svg>
      </span>
      <el-button
        class="w-4/5 mb-6"
        size="large"
        type="danger"
        @click="handleGoBuy"
        round
        >{{ $t("lottery.toBuy") }}</el-button
      >
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ElButton, ElDialog } from "element-plus";
import Turntable from "@/utils/turntable";
import copyContent from "@/utils/copyContent";
import { ElMessage } from "element-plus";
import { api } from "~/api/api";
import type { AwardVO, LotteryVO } from "~/api/types/lottery";
import { sleep } from "@antfu/utils";

const { t, link, ossImg, lang, activityId, loadBgImg } = useLang();
const LotteryNum = ref(0); // 标记抽奖次数
const isDisable = ref(false); // 是否禁用抽奖
const dialogVisible = ref(false);
const isLogin = ref(false);
const winningTips = ref("");
const couponCode = ref("");
let token = useCookie("user-token");
let fetchNum = 0;

// 1、获取奖池信息
let { data: resp } = await api.lottery.getJackpotInfo({ activityId });
const awardList = resp?.awardList;

let { data: currencyInfo } = await api.lottery.getCurrencyInfo();
const { symbol, rate } = currencyInfo;

function CompoundInfo(list: AwardVO[]) {
  // 处理奖池信息为展示数据
  let newList: LotteryVO[] = [];
  list?.forEach((item, index) => {
    newList.push({
      id: item.awardId,
      name: item.awardPrice
        ? `${symbol} ${(Number(item.awardPrice) * rate).toFixed(2)}`
        : "",
      img: {
        width: 65,
        height: 87,
        src: item.awardPic,
      },
      imgSpace: item.awardType === 3 ? 46 : 40,
      color: "#e93031",
      bg: index % 2 ? "#f2c8ad" : "#fff",
    });
  });
  return newList;
}

const width = document.body.clientWidth > 448 ? 448 : document.body.clientWidth;

const turntable = new Turntable({
  size: width * 0.74,
  speed: 10,
  textSpace: 10,
  speedUp: 1000,
  values: CompoundInfo(awardList),
});

// 2、判断用户是否登录
const handleUserLogin = async () => {
  if (!token.value) {
    LotteryNum.value = 0;
    let userInfo = await api.lottery.getUserInfo();
    if (userInfo && userInfo.code === 200) {
      token.value = userInfo?.token;
      isLogin.value = true;
      await handleLotteryNum(userInfo?.token);
    }
  } else {
    await handleLotteryNum();
    isLogin.value = true;
  }
};

// 3、获取抽奖次数
async function handleLotteryNum(userToken?: string) {
  let { data: jackpotNum, code } = await api.lottery.getLotteryNum(
    {
      activityId,
    },
    userToken
  );

  // 防止后端接口一直401导致死循环，最多调用2次
  if (code === 401 && fetchNum < 1) {
    // TODO
    fetchNum++;
    // token?.value = "";
    handleUserLogin();
    return;
  }

  if (code === 200) {
    LotteryNum.value = jackpotNum;
  }
}

onMounted(async () => {
  turntable.draw(document.getElementById("turntable"));
  // token.value =
  //   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyU2VsbGVySWQiOiIyMDIyMDUxMjE3IiwidXNlckRpc3BsYXlOYW1lIjoibW9ubmFfY2hlbiIsInVzZXJFbWFpbCI6Im1vbm5hX2NoZW5AMTYzLmNvbSIsImV4cCI6MTY2NzcyMjEyNCwidXNlcklkIjoiMTAzMSIsImlhdCI6MTY2NzQ2MjkyNCwidXNlclJlZ2lzdGVyZWQiOiIyMDIyLTEwLTMxIDE1OjMwOjAwIn0.o0mEiRdJN1A9yzAPeIU8dGbv9rqjyi_3g4yHQ3UnLUtxDiHI6dq6aPuGgah97RP1F0oDwsAFM2ayJz-g5AKZig";
  await handleUserLogin();
});

// 用户抽奖
const luckyDraw = async () => {
  // dialogVisible.value = true;
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    // GA 埋点
    event: `marketing.lottery.${lang}`,
    ecommerce: {},
  });

  if (!isLogin.value) {
    ElMessage.error(t("lottery.loginTip"));
    window.parent.location.href = `${link}/${
      lang === "en" ? "my-account" : "บัญชีของฉัน"
    }/?redirect_token=lottery`;
  }

  if (LotteryNum.value <= 0) {
    ElMessage.error(t("lottery.tipTwo").replace("<br/>", ""));
    return;
  }

  // 去后台获取抽奖结果
  isDisable.value = true;
  turntable.start();
  let { data: award } = await api.lottery.getLotteryResult({ activityId });

  if (!award) {
    // 马来谢谢惠顾id=29，泰国谢谢惠顾id=45，
    const id = lang === "en" ? 29 : 45;
    turntable.stop(id);
    return;
  }

  turntable.stop(award?.awardId, function () {
    isDisable.value = false;
    LotteryNum.value--;
    couponCode.value = award.couponCode || "";

    if (award.itemId) {
      api.lottery.getGiftInKind(award.itemId);
    }

    winningTips.value = award.resultWord!;
    sleep(1000, () => {
      dialogVisible.value = true;
    });
  });
};

// 判断抽奖次数文案展示
const lotteryNumTip = computed(() => {
  if (!isLogin.value) {
    return t("lottery.noLoginTip");
  } else {
    return LotteryNum.value
      ? t("lottery.tipOne", { name: LotteryNum.value })
      : t("lottery.tipTwo");
  }
});

// 去购买
function handleGoBuy() {
  dialogVisible.value = false;
  let goto = link;
  const referrer = window.parent.document.referrer;
  if (
    referrer &&
    !window.parent.location.search.includes("from=") &&
    referrer?.includes(link) &&
    !referrer?.includes("/my-account/")
  ) {
    goto = referrer;
  }

  window.parent.location.href = goto;

  // navigateTo(`${goto}`, {
  //   external: true,
  // });
}

// 处理券码拷贝
function handleCopyCode(text: string) {
  copyContent(text);
  ElMessage.success(t("lottery.hasCopy"));
}
</script>
<style>
.lotteryWarp {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 10%;
}
.lotteryWarp .el-dialog__body {
  padding: 0 !important;
  text-align: center;
  position: relative;
  color: #000;
}
.lotteryWarp p {
  word-break: keep-all;
}
</style>
<style scoped>
.index-wrap {
  margin: 0 auto;
}
.activity_bg {
  background-repeat: no-repeat;
  background-size: cover;
}
.turntable-wrap {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom;
}
#turntable {
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
}
#turntable::after {
  position: absolute;
  content: "";
  display: block;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 90px;
  background: var(--bgurl) no-repeat;
  background-size: contain;
}
</style>
