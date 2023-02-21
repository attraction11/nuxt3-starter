export interface AwardVO {
  /**
   * 奖品Id
   */
  awardId: number;
  /**
   * 奖品类型1-未中奖 2-优惠券 3-实物赠品
   */
  awardType: number;

  /**
   * 奖品名称
   */
  awardName: string;
  /**
   * 奖品图片
   */
  awardPic: string;
  /**
   * 奖品价值
   */
  awardPrice: string;
}

type ImgVO = {
  width: number;
  height: number;
  src: string;
};

export type LotteryVO = {
  /**
   * 奖品Id
   */
  id: number;
  /**
   * 奖品名称
   */
  name: string;
  /**
   * 背景颜色
   */
  bg: string;
  /**
   * 文字颜色
   */
  color: string;
  imgSpace: number;
  img: ImgVO;
};

export interface AwardRespVO {
  /**
   * 奖品Id
   */
  awardId: number;
  /**
   * 优惠券码
   */
  couponCode?: string;
  /**
   * 实物奖品ID
   */
  itemId?: string;
  /**
   * 是否中奖
   */
  lucky?: boolean;
  /**
   * 中奖文案
   */
  resultWord?: string;
}

// 抽奖返回结构
export type ChanceVO = Omit<ApiResponse, "data"> & { data: AwardRespVO };

// 奖池返回
export type AwardPoolVO = Omit<ApiResponse, "data"> & {
  data: { awardList: AwardVO[] };
};

// 奖池返回
export type CurrencyVO = Omit<ApiResponse, "data"> & {
  data: { symbol: string, rate: number };
};



