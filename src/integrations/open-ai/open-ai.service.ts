import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import openAiConfig from './config/open-ai.config';
import { ConfigType } from '@nestjs/config';
import { CreateBidDto } from '../../users/freelancers/dto/create-bid.dto';
import { Prisma } from '@prisma/client';
const { OpenAI } = require('openai');

@Injectable()
export class OpenAiService {
  private openai = new OpenAI({
    baseURL: 'https://api.aimlapi.com/v1',
    apiKey: this.openaiConfigrations.lamaiApiKey,
  });
  constructor(
    @Inject(openAiConfig.KEY) private readonly openaiConfigrations: ConfigType<typeof openAiConfig>,
  ) {}

  async suggestBid(createBidDto: CreateBidDto, allBidsOnProject: Prisma.BidsGetPayload<{}>[]) {
    if (allBidsOnProject.length === 0) {
      return { message: 'Your bid is within the normal range' };
    }
    const amoutBids = allBidsOnProject.map(bid => Number(bid.amount));
    const averageEstimation = amoutBids.reduce((acc, cur) => acc + cur) / allBidsOnProject.length;
    const { amount, estimatedWork } = createBidDto;
    const prompt = `
        Given the past bids: [10, 12, 14, 18] and a new bid of amount:${amount}, estimatedWork: ${estimatedWork},
        along with an estimated work cost of ${averageEstimation},
        suggest whether the bid is fair or needs adjustment.
        If the bid is too high compared to past bids and the estimated cost, suggest lowering it.
        If it's significantly lower, suggest increasing it to remain competitive.
        Also, provide a brief reasoning based on the estimation and previous bids.
    `;
    const systemPrompt = 'You are a freelancer assesstent agent.';
    const userPrompt = `Given the past bids: ${amoutBids.join(', ')} and a new bid of amount:${amount}, estimatedWork: ${estimatedWork}, along with an estimated work cost of ${estimatedWork} days, suggest whether the bid is fair or needs adjustment `;
    console.log(userPrompt);
    try {
      const response = await this.openai.chat.completions.create({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      });
      const s = response.choices[0].message.content;
      return s;
    } catch (err) {
      throw new BadRequestException('ال ai مريح شوية ');
    }
  }
}
