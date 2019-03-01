Here is the short version. We highly recommend you check out our documentation on hotcakes.org, though. 
We spent a lot of time on it. It would make us all feel really good about it - also we think it would help you. 

In order to get started:
1) Create a class that implements ICartIntegration, ICheckoutIntegration or the IProductIntegration interface
2) Your class can have any custom logic and should return the IntegrationResult object
5) Once you've done your custom work, you can deploy your compiled library the same as other libraries generated using generator-upendodnn
6) Once that's done, you can select your new action delegate integration on the Admin -> Extensibility page in the Hotcakes Commerce admin UI