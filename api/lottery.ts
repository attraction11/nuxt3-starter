import http from "~/api/request";
import { ChanceVO, AwardPoolVO, CurrencyVO } from "./types/lottery";

export const lottery = {
  // 查询奖池
  getJackpotInfo(params: { activityId: number }): Promise<AwardPoolVO> {
    return http.get("/marketing/lucky/draw/query/award/pool", params);
  },

  // 获得当前登录用户IP的货币符号和汇率 (PHP)
  getCurrencyInfo(): Promise<CurrencyVO> {
    return http.get("/wp-admin/admin-ajax.php?action=zm_get_current_currency");
  },

  // 获得登录用户的token (PHP)
  getUserInfo(): Promise<ApiResponse> {
    return http.get("/wp-admin/admin-ajax.php?action=zm_get_user_token");
  },

  // 剩余抽奖机会
  getLotteryNum(
    params: { activityId: number },
    token?: string
  ): Promise<ApiResponse> {
    return http.get("/marketing/lucky/draw/chance/times", params, token);
  },

  // 抽奖
  getLotteryResult(data: { activityId: number }): Promise<ChanceVO> {
    return http.post("/marketing/lucky/draw/use/chance", data);
  },

  // 赠送实物
  getGiftInKind(itemId: string): Promise<ApiResponse> {
    return http.get(
      `/wp-admin/admin-ajax.php?action=zm_add_to_cart&itemId=${itemId}`
    );
  },
};
