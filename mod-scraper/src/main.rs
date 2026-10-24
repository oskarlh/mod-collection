use bullmq_rs::{JobSchedulerTemplate, QueueBuilder, RedisConnection, RepeatOptions};
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Email {
    to: String,
    subject: String,
    body: String,
}

async fn set_up_scheduled_jobs() -> Result<(), Box<dyn std::error::Error>> {
    let conn = RedisConnection::new("redis://127.0.0.1:6379");

    let queue = QueueBuilder::new("emails")
        .connection(conn)
        .build::<Email>()
        .await?;

    // Every 5 minutes, forever
    queue
        .upsert_job_scheduler(
            "cleanup",
            RepeatOptions {
                every: Some(Duration::from_secs(300)),
                ..Default::default()
            },
            JobSchedulerTemplate {
                name: Some("cleanup".into()),
                data: None,
                opts: None,
            },
        )
        .await?;

    // Weekdays at 08:00 Paris time, 10 runs max
    queue
        .upsert_job_scheduler(
            "daily-report",
            RepeatOptions {
                pattern: Some("0 8 * * 1-5".into()),
                tz: Some("Europe/Paris".into()),
                limit: Some(10),
                ..Default::default()
            },
            JobSchedulerTemplate::default(),
        )
        .await?;

    // Inspect / remove
    let schedulers = queue.get_job_schedulers(0, -1).await?;
    println!("schedulers {:?}", schedulers);
    //queue.remove_job_scheduler("cleanup").await?;
    return Ok(());
}

#[tokio::main]
async fn main() {
    match set_up_scheduled_jobs().await {
        Ok(_) => {
            println!("Success")
        }
        Err(err) => {
            println!("Failure {:?}", err)
        }
    }
    println!("Hello, world!");
}
