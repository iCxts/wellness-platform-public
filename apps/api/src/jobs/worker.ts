import { createWorker } from "./queue.js";
import { STANDBY_PROMOTION, processStandbyPromotion } from "./standby-promotion.job.js";
import { NO_SHOW_TAGGER, processNoShowTagger } from "./no-show-tagger.job.js";
import { ABSENCE_CHECKER, processAbsenceChecker } from "./absence-checker.job.js";
import { REMINDER, processReminder } from "./reminder.job.js";

export function startWorker() {
    createWorker(async (job) => {
        switch (job.name) {
            case STANDBY_PROMOTION:
                await processStandbyPromotion(job.data.sessionId);
                break;
            case NO_SHOW_TAGGER:
                await processNoShowTagger(job.data.sessionId);
                break;
            case ABSENCE_CHECKER:
                await processAbsenceChecker();
                break;
            case REMINDER:
                await processReminder(job.data.sessionId, job.data.sessionTitle, job.data.window);
                break;
            default:
                console.warn(`Unknown job: ${job.name}`);
        }
    });

    console.log("Worker started");
}
