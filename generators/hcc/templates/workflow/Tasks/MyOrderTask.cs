
using System;
using Hotcakes.Commerce.BusinessRules;
using Hotcakes.Commerce.Orders;

namespace <%= fullNamespace %>.MyWorkflow.Tasks
{
    public class MyOrderTask : OrderTask
    {
        public override Task Clone()
        {
            return new MyOrderTask();
        }

        public override bool Execute(OrderTaskContext context)
        {
            try
            {
                context.Order.Notes.Add(new OrderNote
                {
                    IsPublic = false,
                    Note = "Hi " + context.Order.ShippingAddress.FirstName
                });
                context.Outputs.Add(new WorkflowMessage(
                    "Hi",
                    context.Order.ShippingAddress.FirstName,
                    true));

                // TODO : My custom logic goes here
            }
            catch
            {
                return false;
            }

            return true;
        }

        public override bool Rollback(TaskContext context)
        {
            return false;
        }

        public override string TaskId()
        {
			// TODO: change this GUID to be a unique value
            return "{<%= task2Guid %>}";
        }

        public override string TaskName()
        {
            return "My order task";
        }

        public override bool Rollback(OrderTaskContext context)
        {
            throw new NotImplementedException();
        }
    }
}