
using DotNetNuke.Entities.Controllers;
using DotNetNuke.Instrumentation;
using DotNetNuke.Services.Exceptions;
using DotNetNuke.Services.Scheduling;
using System;
using System.Linq;

namespace <%= fullNamespace %>.ScheduledJobs
{
    /// <summary>
    /// A scheduled job that can be managed in DNN.
    /// </summary>
    public class ExampleScheduledJob : SchedulerClient
    {
        private static readonly ILog Logger = LoggerSource.Instance.GetLogger(typeof(ExampleScheduledJob));

        /// <summary>
        /// Gets things started...
        /// </summary>
        /// <param name="oItem"></param>
        public ExampleScheduledJob(ScheduleHistoryItem oItem) : base()
        {
            ScheduleHistoryItem = oItem;
        }

        /// <summary>
        /// This method does all of the real work.
        /// </summary>
        public override void DoWork()
        {
            try
            {
                // Perform required items for logging
                Progressing();

                ScheduleHistoryItem.AddLogNote("ExampleScheduledJob Starting");
                Logger.Debug("ExampleScheduledJob Starting");

				//
                // do something here
				//

                ScheduleHistoryItem.AddLogNote("ExampleScheduledJob Completed");
                Logger.Debug("ExampleScheduledJob Completed");

                // Show success
                ScheduleHistoryItem.Succeeded = true;
            }
            catch (Exception ex)
            {
                Logger.Error(ex);
                ScheduleHistoryItem.Succeeded = false;
                ScheduleHistoryItem.AddLogNote("Exception:: " + ex.ToString());
                Exceptions.LogException(ex);
            }
        }
    }
}