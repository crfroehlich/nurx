# drizly-assessment
Drizly Software Engineer Blind Assessment

## Code Problem

You are given a feature to display the median price of a given beverage type. Given an n sized unsorted array of integer prices, write a function findMedian([]) to return the median price. You can assume that the array will contain at least one element.
Tests:

```
findMedian([1,6,3,5,8,9,4,10,2]) => 5
findMedian([1,6,3,5,8,9,4,10,2,7]) => 5.5
```

### Answer

The solution to the problem is located in `drizly.test.ts`, which is written in TypeScript. You can run this test by following these steps:

1. Unzip `drizly-assessment.zip` to a folder
1. `cd drizly-assessment`
1. `yarn install`
1. `yarn test`

In the console you will see the output of the two tests that assert the correctness of the solution. The code is fully commented to help explain the process.

Since a `median` is, roughly speaking the value that splits a collection into two halves; then given an array of numbers, we need only to numerically sort the numbers in the array and then determine the middle position. As most languages implement such a sorting algorithm natively, I have used this for the first example and then used a merge-sort algorithm for the second example. The results of sorting are identical as is the answer to the code challenge.

## Developer Question

```
As it pertains to the role you are interviewing for, please describe a time when a technical project or assignment didn’t go as planned. How would you approach the situation differently in the future? Please include information about the purpose of the project, the people involved, what went wrong, the consequences of it not going as planned and how you would do things differently in the future.
```

### Answer

To answer this question, I will start by providing a little context to the decision making process. One of the many feature development tasks required at NS8 was eCommerce platform integrations. Many merchants when choosing to sell their products online will choose an eCommerce platform (like Shopify, Magento, BigCommerce, X-Cart, etc) to organize their digital storefront. Almost all of these platforms have a concept of an "app store" or "marketplace" or some formalized process for merchants to extend the platform with additional functionality provided by a 3rd party vendor. In this case, the platform is Magento, the 3rd party vendor is NS8 and the "extension" is called "Protect". One of the goals of creating a "Protect" extension for an eCommerce platform is to allow orders placed on the platform to be rated for probability of fraud by the NS8 platform. In broad terms, this requires instrumenting the ability for the platform to call out to the NS8 APIs when an order is placed, and for NS8 to notify the platform when the order's rating has been computed. Many eCommerce platforms are cloud-only (such as Shopify), which means that every merchant running on the platform is guaranteed to have the same version of the platform code and the same features/limitations defined by the platform as every other merchant on the same platfor. Adobe's Magento platform differs dramatically in that a merchant can run their store on Adobe's Cloud or self-hosted, where a merchant can run any configuration of the platform they choose on their own hardware.

In the design phase of developing a NS8 Protect integration for Adobe Magento, I identified the hidden complexities of self-hosted configurations as the most complicated to tackle and therefore the most risky to introduce into an MVP. NS8's goal for MVP was to have a functional prototype of Protect running on Magento that could be used by beta testers, which included Walmart and Just for Men. The decision making around the design plans for the architecture involved the CTO and the CEO of NS8, so this was not a set of decisions taken lightly; however, I was the person responsible for crafting and pitching this idea and getting the required buy-in from the business. Broadly speaking, what I proposed was this: for the MVP of the product, my team would develop the Protect integration on the assumption that it would be installed on a cloud environment, against which we could make a couple of assumptions:

1. The Cloud instances by their very nature would be public, which would guarantee that the platform APIs were also public.
1. Protect would be able to call back into the cloud instance asynchronously.

These assumptions acknowledged the risks and challenges of self-hosted solutions, namely that a self-hosted instance:

1. Could be behind a firewall or VPN or in some other configuration not available to the public.
1. Can not accept incoming API calls or asynchronous requests.

So the decision was made to architect Protect on Magento to operate by a callback style approach which assumed the availability of either WebHooks or an API on the platform. The long term solution would wait until after MVP and would likely involve some form of long polling or queueing.

Development of the MVP of Protect on Magento ran from September 2019 through January 2020, and delivery to Just for Men failed for two reasons. First, JFM's Magento stores lock down the Magento APIs and restrict them to access by a list of IP addresses. Second, JFM runs multiple storefronts on the same platform. It would take months to refactor the integration to meet these concerns.

So as stated above, the first reason for failure was something I identified as a known weakness in my design approach for MVP--so how is it possible that we failed to deliver? The answer is quite simple: not one person asked our beta customers how their storefronts were configured. This was not a fault of intentions, rather a failure to triple check all assumptions before getting started. I most certainly asked the Sales and Support teams to confirm with our beta customers that the customers met the basic requirements for our MVP (if they did not, our requirements for MVP were wrong). Undoubtedly, the nuance of "Is the storefront API public?" was lost in translation and the question became "Is the storefront public?"--so some such similar reduction in meaning. What was required is a more deterministic test that asserts this, of which many methods are viable. I think the collective failure was that no one, myself included, ever challenged the conclusion until I started delivering early drafts of the MVP to JFM for initial testing. Only after months of development work was the underlying assumption challenged--self-hosted solutions were not the edgecase, they were the norm and cloud-hosted solutions were not the norm, they were the edgecase. We got it backwards, and it cost an extra 6-8 weeks in development and QA to refactor the product to support both cloud and self-hosted solutions.

The second failure is more indicative of the actual problem in process. The first failure (making the wrong assumption about what functionality needed to be included in MVP) could almost be chocked up to bad design and decision making or poor communication; but when you consider the second issue, the true nature of the mistake becomes clear. JFM's parent company runs multiple other storefronts on the same Magento instance. This is a use case that was never even considered--something we didn't think any existing or future user wanted or was using (also happens to be a difficulty very specific to Magento).

No one sat down with JFM and asked them how they used Magento. No one asked JFM how they expected to be able to use Protect. The critical error in judgment is then much simpler to understand: developers did not understand how the customer intended to use the product.

In many ways, I had already identified and fixed this issue with other projects and other customers; but I never went back to second guess what we were doing for JFM until we were far enough along in development that a course correction became necessary and costly. Going forward, I like to ensure that at least some of these things are done before I embark on significant design or architectural work:

1. Clearly identify the market for the work. Understand who expects to use the product; understand how different customers will use the product differently.
1. Participate in the selection of first users of the unfinished product. As these users to demonstrate how they use the product and how it fits into the rest of the platform and other products they use. Record these conversations for posterity and take exhaustive notes.
1. Present a layman terms design plan to the first users to ensure their needs are going to be met.
1. Coordinate with Sales and Support to ensure that the right questions are asked of future users. Keep clear and open channels of communication with the Sales and Support departments so that changes in requirements can be collected.
1. Keep a transparent record of all design decisions that include (a) the choices made, (b) trade-offs and concessions, (c) risks considered, (d) all parties involved in the decision making, (e) dates, (f) updated roadmap to address trade-offs/concessions or features not in scope.
1. Ensure that everyone involved with the customer fully understands what is being delievered, why and when.

Key to the failure described here is that all parties operated in good faith and with the best intentions. The cost to the business and the near loss of a customer was not due to poorly planned or written code; the cost was incurred because the problems being solved were not well understood. Understanding the problem is cheap--it requires dilligence and attention to detail and follow through to matter.
