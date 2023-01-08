// q3
// In `student.psv` there are some fake student datas from UNSW CSE (no doxx!). In each row, the fields from left to right are
//
// - UNSW Course Code
// - UNSW Student Number
// - Name
// - UNSW Program
// - UNSW Plan
// - WAM
// - UNSW Session
// - Birthdate
// - Sex
//
// Write a Rust program to find the course which has the highest average student WAM.

use serde::Deserialize;
use std::collections::HashMap;
use std::fs::File;

#[derive(Deserialize)]
struct Record {
    pub course_code: String,
    pub student_number: i32,
    pub name: String,
    pub program: String,
    pub plan: String,
    pub wam: f32,
    pub session: String,
    pub birthdate: i32,
    pub sex: String,
}

fn main() {
    let file = File::open("C:\\Users\\kbpal\\Documents\\Development\\2023-projects-technical-questions\\chaos\\q1-backend\\student.psv").expect("Couldn't open file");
    let mut reader = csv::ReaderBuilder::new()
        .delimiter(b'|')
        .has_headers(false)
        .from_reader(file);

    //                      Course Code, (WAM Total, count of WAMS added)
    let mut course_wams: HashMap<String, (f32, i32)> = HashMap::new();

    // Parse WAMs from file and save to HashMap
    for record in reader.deserialize() {
        let record: Record = record.expect("Could not parse input file");

        if let Some((total, num)) = course_wams.get(&*record.course_code).cloned() {
            course_wams.insert(record.course_code, (total + record.wam, num + 1));
        } else {
            course_wams.insert(record.course_code, (record.wam, 1));
        }
    }

    let mut highest_average: f32 = 0.0;
    let mut highest_wam_course_code: String = String::new();

    // Calculate averages
    for (course_code, (total, num)) in course_wams {
        let average = total / (num as f32);

        if average > highest_average {
            highest_average = average;
            highest_wam_course_code = course_code;
        }
    }

    println!(
        "Course with highest average WAM: {} | Average WAM: {}",
        highest_wam_course_code,
        highest_average,
    );
}
