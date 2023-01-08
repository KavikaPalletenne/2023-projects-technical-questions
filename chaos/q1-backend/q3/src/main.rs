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
use csv::Reader;

#[derive(Deserialize)]
struct Record {
    pub course_code: String,
    pub _student_number: i32,
    pub _name: String,
    pub _program: String,
    pub _plan: String,
    pub wam: f32,
    pub _session: String,
    pub _birthdate: i32,
    pub _sex: String,
}


fn load_psv(path: &str) -> Reader<File> {
    let file = File::open(path).expect("Couldn't open file");
    csv::ReaderBuilder::new()
        .delimiter(b'|')
        .has_headers(false)
        .from_reader(file)
}

fn parse_wams(mut reader: Reader<File>) -> HashMap<String, (f32, i32)> {
    //                            (code, (total, count))
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

    course_wams
}


fn calculate_highest_wam_course(course_wams: HashMap<String, (f32,i32)>) -> (String, f32) {
    let mut highest_average: f32 = 0.0;
    let mut highest_wam_course = String::new();

    for (course_code, (total, num)) in course_wams {
        let average = total / (num as f32);

        if average > highest_average {
            highest_average = average;
            highest_wam_course= course_code;
        }
    }

    (highest_wam_course, highest_average)
}


fn main() {
    let reader = load_psv("..\\student.psv");

    let course_wams = parse_wams(reader);

    let (highest_wam_course, highest_average) = calculate_highest_wam_course(course_wams);

    println!(
        "Course with highest average WAM: {} | Average WAM: {}",
        highest_wam_course,
        highest_average,
    );
}
