# elastic_apm_quick_start
Elastic APM Quick Start 가이드입니다.

- 실습 환경
	- OS : macOS
	- 샘플 애플리케이션 : NodeJS
	- Elasticsearch 버전 : 6.2.3
	- Kibana 버전 : 6.2.3
	- APM Server 버전 : 6.2.3

- X-Pack은 설치 후에 Basic License로 적용 가능하기에 되도록 적용해서 사용하시길 권장합니다. X-Pack이 활성화 되어야 APM UI를 사용할 수 있습니다. (대시보드는 X-Pack 없이도 사용 가능.)
- 본 가이드에서 사용하는 터미널 명령어는 Linux 명령어로 작성되었습니다. Windows 환경일 경우 Windows 환경에 맞게 작업해주시면 됩니다. 그 외에 설정 내용들은 모두 동일합니다. 

## 1. Elasticsearch, Kibana, APM Server 다운로드
* https://www.elastic.co/downloads/elasticsearch
* https://www.elastic.co/downloads/kibana
* https://www.elastic.co/downloads/apm
* 설치 후 압축 해제
~~~
demo$ ls -l
total 0
drwxr-xr-x@ 11 reddy  staff   374B  4 2 13:46 apm-server-6.2.3-darwin-x86_64
drwxr-xr-x@ 11 reddy  staff   374B  4 2 13:08 elasticsearch-6.2.3
drwxr-xr-x@ 16 reddy  staff   544B  4 2 13:25 kibana-6.2.3-darwin-x86_64
~~~

## 2. Elasticsearch 설정 및 실행
#### 2-A. Elasticsearch 실행 (X-Pack 사용 안 할 경우 해당 단계로 진행)
~~~
elasticsearch-6.2.3$ ./bin/elasticsearch
~~~
#### 2-B. Elasticsearch 설정 및 실행 (X-Pack 사용 할 경우 해당 단계로 진행)
~~~
elasticsearch-6.2.3$ ./bin/elasticsearch-plugin install x-pack
~~~
~~~
elasticsearch-6.2.3$ ./bin/elasticsearch
~~~
Elasticsearch가 구동 중일 때 새 터미널을 열고 아래 명령어를 입력한다.
~~~
elasticsearch-6.2.3$ ./bin/x-pack/setup-passwords auto
~~~
위의 커맨드 입력 후 출력된 로그인 정보는 잘 보관한다.
아래와 같은 형식으로 출력
~~~
Changed password for user kibana
PASSWORD kibana = XXXXXXXXXXXXXXXX

Changed password for user logstash_system
PASSWORD logstash_system = XXXXXXXXXXXXXXXX

Changed password for user elastic
PASSWORD elastic = XXXXXXXXXXXXXXXX
~~~

## 3. Kibana 설정 및 실행
#### 3-1. Kibana X-Pack 설치 (X-Pack 사용할 경우)
~~~
kibana-6.2.3-darwin-x86_64$ ./bin/kibana-plugin install x-pack
~~~
#### 3-2. Kibana User 설정 (X-Pack 사용할 경우)
~~~
kibana-6.2.3-darwin-x86_64$ vi ./config/kibana.yml

# 아래 항목에 앞에서 생성된 로그인 정보를 입력한다. (주석이 있다면 제거)
elasticsearch.username: "kibana"
elasticsearch.password: "<kibana_pw>"
~~~
#### 3-3. Kibana 실행
~~~
kibana-6.2.3-darwin-x86_64$ ./bin/kibana
~~~

## 4. APM Server 설정 및 실행
#### 4-1. Elastic User 설정 (X-Pack 사용할 경우)
~~~
apm-server-6.2.3-darwin-x86_64$ vi apm-server.yml

# 아래 항목에 앞에서 생성된 로그인 정보를 입력한다. (주석이 있다면 제거)
username: "elastic"
password: "<elastic_pw>"
~~~
#### 4-2. APM Server Setup
Setup을 진행하면 APM 대시보드가 생성 된다. 건너 뛰면 대시보드가 생성되지 않는다.
~~~
apm-server-6.2.3-darwin-x86_64$ ./apm-server setup
~~~
#### 4-3. APM Server 실행
~~~
apm-server-6.2.3-darwin-x86_64$ ./apm-server -e
~~~

## 5. sample-node-app 다운로드 및 실행
※ 실행 환경에 Git, NodeJS 설치 필수
#### 5-1. sample-node-app 다운로드
~~~
elasticapm$ git clone https://github.com/iamyoungrok/elastic_apm_quick_start.git
~~~
#### 5-2. sample-node-app 디렉토리로 이동
~~~
elasticapm$ cd elastic_apm_quick_start/sample-node-app
~~~
#### 5-3. Node 패키지 설치
~~~
sample-node-app$ npm install
~~~
npm으로 의존성 패키지 설치 시 package.json에 명시된 'elastic-apm-node' 라이브러리도 함께 설치 된다.
#### 5-4. SQL 테스트를 위해 설정 파일에 DB 정보 입력(SQL 테스트 안할 시 건너 뛰어도 무방)
~~~
sample-node-app$ vi config.js
~~~
아래 항목에 정보를 기입한다.
~~~
var config = {
	database: {
		host:	  '', 				// database host
		user: 	  '', 			// your database username
		password: '', 			// your database password
		port: 	  3306, 		// default MySQL port
		db: 	  '' 					// your database name
	}
}
~~~
#### 5-5. Node 실행
~~~
sample-node-app$ node app.js
~~~
#### 5-6. 브라우저 접속 테스트
- 브라우저에서 http://localhost:8001 주소로 접속
- sample-node-app에서 지원되는 테스트 URL 목록은 다음과 같다.
  - SQL 테스트 : http://localhost:8001/test/sql
  - 외부 HTTP 호출 테스트 : http://localhost:8001/test/http
  - 사용자 에러 캡쳐 테스트 : http://localhost:8001/test/error

## 6. Kibana 접속 테스트
Kibana에 접속하여 APM 관련 데이터가 잘 보이는지 확인
- http://localhost:5601
> X-Pack Security 기능이 활성화 되어 있으면 로그인 정보를 넣어야 하는데, 'kibana' 유저가 아닌 'elastic' 유저로 접속을 해야 APM 관련 데이터를 모두 볼 수 있다.
