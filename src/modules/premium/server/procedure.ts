import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import {
  createTRPCRouter,
  // baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import {  count,eq} from "drizzle-orm";
import { polarClient } from "@/lib/polar";
export const premiumRouters = createTRPCRouter({
  getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });
    const subcription = customer.activeSubscriptions[0];
    console.log(subcription);

    console.log("before");
    if (subcription) return null;
    console.log("after");

    const [userMeeting] = await db
      .select({ count: count(meetings.id) })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));
    const [userAgent] = await db
      .select({ count: count(agents.id) })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));

    return {
      meetingCount: userMeeting.count,
      agentCount: userAgent.count,
    };
  }),
  getProduct: protectedProcedure.query(async () => {
    const products = await polarClient.products.list({
      isArchived: false,
      sorting: ["price_amount"],
        
    });

    console.log(products, "from server");

    return products.result.items;
  }),

  getsCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });
    const subscription = customer.activeSubscriptions[0];

    if (!subscription) {
      return null;
    }

    const products = await polarClient.products.get({
      id: subscription.productId,
    });

    return products;
  }),
});
