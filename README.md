# Node.js consumer Pact interceptor
This is a pure Node.js implementation of the PACT system of mocking and testing
system integration points. It is presently in an **Alpha** state and you
should expect some bugs. Be sure to read the caveats below.

- [Quickstart](#quickstart)
- [Workflow](#workflow)
- [Why?](#why)
- [How does it work?](#how-does-it-work)
- [Caveats](#caveats)

## Quickstart
See the [`test/test.js`](test/test.js) for the fastest way to get started.

## Workflow
This assumes understanding of [Consumer driven contracts](http://martinfowler.com/articles/consumerDrivenContracts.html)
and the [Pact v2 specification](https://github.com/pact-foundation/pact-specification/tree/version-2).

1. Create Pact JSON spec.
2. Create a setState function to pass to the interceptor, the setState function typically send a request to the api under test.
3. Request will be intercepted as outgoing HTTP requests.
4. Verify the response(s) returned from the interceptor.
5. Publish Pact to broker.

## Why?
There is a [JS DSL](https://github.com/DiUS/pact-consumer-js-dsl) for creating pacts which
is already compatible with the Pact v2 Spec. However, this requires the use of a ruby
server with which to create assertions with.

We found that it was difficult to induct new developers into using this system and the
incidental complexity barrier (often compounded by CI servers and docker-containers)
was such that this became a real pain-point.

## How does it work?
The interceptor is just wrapping the excellent [MITM library](https://www.npmjs.com/package/mitm)
which is catching outgoing HTTP requests at the Node.js core level and allowing
responses to be injected.

From a high-level, the interceptor waits for requests the URL it's watching and, once
it receives them, it will try verify this against the Pact specification. If it fails
to do so, it will return an assertion error, if there is no assertion failures it
will respond as per the Pact specification.

## Caveats
- As yet this **does not fully implement Pact V2**. At the time of writing I have been unable
to fully meet the requirements of nested type-matching.
- Outgoing HTTP or socket requests which are not part of the pact test are going to be blocked.
This is unfortunate and less than ideal. I have not yet found a way to use MITM's API to allow
HTTP requests on a per-url basis.
