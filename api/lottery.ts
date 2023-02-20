import http from "~/api/request";
import { JackpotVO, PrizeVO } from "~/types/lottery";

export const lottery = {
  // 获取奖池信息
  getJackpotInfo(): Promise<ApiResponse& {data: JackpotVO[]}> {
    return http.get("/jackpot/detail");
  },

  // 获取用户信息
  getUserInfo(): Promise<ApiResponse> {
    return http.get("/php/userInfo");
  },

  // 获取抽奖次数
  getLotteryNum(): Promise<ApiResponse> {
    return http.get("/jackpot/number");
  },

  // 获取抽奖结果
  getLotteryResult(): Promise<ApiResponse & {data: PrizeVO}> {
    return http.get("/jackpot/result");
  },
};
