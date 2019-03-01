
using Hotcakes.Commerce.BusinessRules;

namespace <%= fullNamespace %>.MyWorkflow.Tasks
{
    public class MySimpleTask : Task
    {
        public override Task Clone()
        {
            return new MySimpleTask();
        }

        public override bool Execute(TaskContext context)
        {
            try
            {
                context.Outputs.Add(new WorkflowMessage("Hi", "Customer", true));

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
            return "{<%= task1Guid %>}";
        }

        public override string TaskName()
        {
            return "My simple task";
        }
    }
}