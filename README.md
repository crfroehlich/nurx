# nurx-assessment
NURX Software Engineer Assessment

## Prescription Routing

After a patient requests a new prescription, and our medical team has written a new prescription, our system must automatically determine the cheapest way to fill a given order. This routing is subject to the following set of constraints:

- We want to minimize the total cost of fulfilling an order, which is determined by the `inventory.cost` x `orderItem.quantity`
- A single Order can be fulfilled by multiple pharmacies, but a single OrderItem cannot be split across more than one pharmacy
- Assignments should contain OrderItems, not Orders, to allow an individual order to be fulfilled with a single shipment by a single pharmacy or multiple shipments by multiple pharmacies

A simplified object model in UML is provided below that shows the relationships and types of your function. In a language of your choosing, implement the assign(Order) function.

Please comment your implementation and make note of assumptions, tradeoffs, and limitations in the architecture, as well as any exceptions that the fulfillment assignment algorithm must consider.

If you have any questions, please do not hesitate to ask. Feel free to extend the model as needed, but take care not to modify the specified requirements.

## Solution

This solution is written in TypeScript for NodeJs and corresponding assumptions for running the solution apply.

### Running the Code

- `yarn install`
  - If yarn is not installed, `npm -g install yarn`
- `yarn test`

A unit test will execute with results piped to the console. The supplied test is VERY simple and is not intended to represent an exhaustive suite of tests, which would be difficult to compose completely given the time constraints. Rather than draft a partial suite, which might indicate incompleteness, I elected to write a minimal set of tests simply to illustrate how the code is executed and that it does execute correctly in at least a few cases.

The code is implemented in 2 files: `nurx_data_model.ts` contains the data model as defined by the code challenge and `nurx_routing.ts` contains the implementation of the router logic. The tests are located in `nurx.test.ts`.

### Assumptions

- This code assumes that all methods will receive valid inputs--no input validation is performed inside this solution.
- Since the pharmacy inventory does not have a concept of quantity, the `estimateOrderCost` method is not required to be implemented; this solution only considers the inventory cost as no other calculation is necessary (i.e. the pharmacy with the lowest drug cost is always going to be cheapest)
- This solution assumes that requests to route an order will have only unique drugs; while duplicate drug items inside the same order do not affect the technical correctness of the result, the result may not be what users expect

### Limitations

- In the real world, pharmacy inventory would have a quantity per drug in stock and the assignment logic would need to factor in the available quantity with the requested quantity and route the order item to the pharmacy that has the requested quantity at the lowest cost
- As this solution is implemented without knowledge of or access to a persistent storage of data, the router must require the pharmacy data to be defined on construction; this would not be ideal for real world use cases for a wide variety of concerns
- This solution (by design) ignores many other real world factors that would impact total cost analysis (e.g. shipping cost, pharmacy location, shipment address, generic vs name brand drugs, time to ship vs urgency of request, etc)

### Tradeoffs

- The filter/map/reduce approach works fine for testing local, development, test-only data sets but would not scale well against production data
- Readability was favored over algorithmic efficiency